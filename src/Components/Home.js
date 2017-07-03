import React, { Component } from 'react';
import '../App.css';
import TripMembers from './TripMembers'
import * as firebase from 'firebase'
import Expense from './Expense'
import Bill from './Bill'
import Storage from './Storage'


class Home extends Component {
    constructor(){
        super();
       this.state={
           newTrip:'',
           memberCount:'',
           trip:'',
           myTrips:[],
           tripInfo:'',
           members:[],
           viewExpense:false,
           myImages:[],
       };
        this.clearState = this.clearState.bind(this);
    }

    componentDidMount(){
        let by=this.props.user;
        let myTripLocal = [];
        this.setState({
            myTrips:[]
        });
        let rootRef = firebase.database().ref().child('trip');
        rootRef.on('value', snap => {
           let object1=snap.val();
            for(let key in object1){
                let obj=object1[key];
                console.log("Object is in home:",obj.members);
                if(obj.members.indexOf(by)!==-1){
                    myTripLocal.push(obj);
                    console.log("!!!!!!!!!",obj)
                }
            }
            this.setState({
                myTrips:myTripLocal
            })
        });
        rootRef.on('child_added', snap => {
            console.log('****child added',snap.val());
        });
    }

    logOut(){
        firebase.auth().signOut();
    }

    onChangeHandler(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    /*onChangeCategory(event){
        if(event.target.value === 'Select Trip'){
            alert("this cannot be a trip")
        }else {
            this.setState({
                trip: event.target.value
            }, () => {
                this.state.myTrips.map((item)=>{
                    if(item.tripName === this.state.trip){
                        this.setState({
                          tripInfo:item.tripName,
                            members:item.members,
                            viewExpense:true
                        })
                    }
                })
            })
        }
    }*/

    onChangeCategory(event){
        let imageArray = [];
        if(event.target.value === 'Select Trip'){
            alert("this cannot be a trip")
        }else {
            this.setState({
                trip: event.target.value
            }, () => {
                this.state.myTrips.map((item)=>{
                    if(item.tripName === this.state.trip){
                        this.setState({
                            tripInfo:item.tripName,
                            members:item.members,
                            viewExpense:true,
                        })
                    }
                })

                //query for retrieving img files into a select dropdown

                let rootRef = firebase.database().ref().child('trip');
                rootRef.orderByChild("tripName").equalTo(this.state.trip).on('value', function (snapshot) {
                    console.log('snapshot.val()',snapshot.val());
                    if(snapshot.child !== -1) {
                        snapshot.forEach(function (childSnapshot) {
                            console.log('$$$$$$$$$$', childSnapshot.val());
                            if (childSnapshot.val().imageFiles !== -1) {
                                childSnapshot.ref.child('imageFiles').on('value', function (imageSnap) {
                                    imageSnap.forEach(function (childImageSnap) {
                                        let url = childImageSnap.val().imageURL;
                                        //let imageName = url.replace(/^.*[\\\/]/, ''); //==============to get only name of picture from url.
                                        console.log('**************************', url);
                                        imageArray.push(url);

                                    })
                                })
                            }
                            return true;
                        })

                    }

                });

                this.setState({
                    myImages: imageArray
                },function(){
                    console.log('imageArray',this.state.myImages);
                })

            })
        }

    }

    clearState(){
        console.log("`````````````````")
        this.setState({
            trip:'',
            memberCount:''
        },()=>{
            console.log("```````````````",this.state.trip,this.state.memberCount)
        })
    }


    render() {

        return (
            <div>
                <div className="navContainer">
                    <div>
                        <center><img className="friendsImage" src={this.props.photo}  /></center>
                        <div className="myEmail color-green-text"><label>{this.props.user}</label></div>
                    </div>


                    <div className="searchingAdding">

                        <div id="modalTrip" className="modal fade register-modal" role="dialog">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4 className="modal-title register-tag">Plan new Trip :)</h4>
                                    </div>
                                    <div className="modal-body">
                                        <input className="trip"
                                               type="text"
                                               placeholder="Enter new trip name or any event"
                                               name="trip"
                                               onChange={this.onChangeHandler.bind(this)}
                                               value={this.state.trip}/>
                                        <input className="trip"
                                               type="text"
                                               placeholder="Enter number of members"
                                               name="memberCount"
                                               onChange={this.onChangeHandler.bind(this)}
                                               value={this.state.memberCount}/>
                                        <TripMembers memberCount={this.state.memberCount} trip={this.state.trip} user={this.props.user} clearState={this.clearState}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <select className="dropdown" onChange={this.onChangeCategory.bind(this)} value={this.state.trip}>
                        <option value="Select Trip">Select Trip</option>
                        {this.state.myTrips.map((item)=>(
                            <option value={item.tripName}>{item.tripName}</option>
                        ))}
                    </select>

                    <Storage trip={this.state.trip} user={this.props.user} myImages={this.state.myImages}/>


                    <button className="signInButton" onClick={this.logOut.bind(this)}>LogOut</button>
                </div>
                {this.state.viewExpense ?
                    <div>
                        <Expense tripInfo={this.state.trip} members={this.state.members}  user={this.props.user}/>
                        <Bill tripName={this.state.trip} members={this.state.members} user={this.props.user}/>
                    </div>:''}
            </div>
        );
    }
}

export default Home;
