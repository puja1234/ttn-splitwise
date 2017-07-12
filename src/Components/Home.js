import React, { Component } from 'react';
import '../App.css';
import TripMembers from './TripMembers'
import * as firebase from 'firebase'
import HomePage from './HomePage'
import OriginalMembers from './OriginalMembers'
import ViewGallery from './ViewGallery'
import ViewExpense from './ViewExpense'
import { BrowserRouter as Router, Route } from 'react-router-dom'

class Home extends Component {
    constructor(){
        super();
        this.state={
            newTrip:'',
            memberCount:'',
            trip:'',
            tripId:'',
            myTrips:[],
            members:[],
            viewExpense:false,
            viewGallery:false,
            myImages:[],
            displayStorage:false,
            showMembers : false,
            localMembers : '',
            deleteMembers : false,
            showInput : false
        };
        this.clearState = this.clearState.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount(){
        let by=this.props.user;
        let myTripLocal = [];
        this.setState({
            myTrips:[]
        });

        let rootRef = firebase.database().ref().child('trip');
        /*rootRef.on('value', snap => {
            myTripLocal=[];
            let object1=snap.val();
            console.log("inside home component ",snap.val());
            for(let key in object1){
                let obj=object1[key];
                if(obj.members.indexOf(by)!==-1){
                    myTripLocal.push(obj);
                }
            }

            this.setState({
                myTrips:myTripLocal
            })
        });*/
        myTripLocal=[];
        rootRef.on('child_added',snap =>{
            if(snap.val().members.indexOf(by) !== -1){
                console.log("inside home component",snap.val(),snap.key);
                let obj=snap.val();
                obj.id=snap.key;
                myTripLocal.push(obj);
                console.log("inside home component 2",myTripLocal);
                this.setState({
                    myTrips:myTripLocal
                },()=>{
                    console.log("3",this.state.myTrips)
                })
            }
        });


    }

    logOut(){
        firebase.auth().signOut();
        window.location.href='/'; //also tried <Redirect to='/'/> , but nothig happened.
    }

    onChangeHandler(event, key){
        if(key === 'memberCount'){
            let regex = /^[0-9]{1,10}$/;
            if(regex.test(event.target.value)===false && event.target.value !== ''){
                alert("Member count can only be number")
            }else{
                this.setState({
                    displayStorage:false,
                    showMembers:false,
                    viewExpense:false,
                    deleteMembers : false,
                    [event.target.name]: event.target.value
                });
            }
        }else{
            this.setState({
                displayStorage:false,
                showMembers:false,
                viewExpense:false,
                deleteMembers : false,
                [event.target.name]: event.target.value
            });
        }
    }

    onChangeCategory(event){
        console.log(this.state.myTrips[event.target.value]);
        let imageArray = [];
        let that = this;
        let tripMembers = 0;
        let flag = 0;
        let updateImageState = function(){
            that.setState({
                myImages: imageArray,
                displayStorage:true
            },() => {
                flag = 1;
                console.log('value of flag----',flag);
            });
        };

        if(event.target.value === 'Select Trip'){
            alert("this cannot be a trip")
        }else {
            this.setState({
                trip: this.state.myTrips[event.target.value].tripName,
                tripId:this.state.myTrips[event.target.value].id
            }, () => {
                this.state.myTrips.map((item)=>{
                    if(item.tripName === this.state.trip){
                        this.setState({
                            members:item.members,
                            viewExpense:true,
                        })
                    }
                });

                let rootRef = firebase.database().ref().child('trip');
                rootRef.orderByChild("tripName").equalTo(this.state.trip).on('value', function (snapshot) {
                    imageArray=[];
                    if(snapshot.child !== -1) {
                        snapshot.forEach(function (childSnapshot) {
                         tripMembers =  childSnapshot.val().members.length;
                            if (childSnapshot.val().imageFiles !== -1) {
                                childSnapshot.ref.child('imageFiles').on('value', function (imageSnap) {
                                    imageSnap.forEach(function (childImageSnap) {
                                        let url = childImageSnap.val().imageURL;
                                        imageArray.push(url);
                                    })
                                })
                            }
                            return true;
                        });

                        that.setState({
                            localMembers : tripMembers
                        })

                    }
                    updateImageState();

                });
            })
        }
    }

    clearState(){
        this.setState({
            trip:'',
            memberCount:''
        })
    }

    editMembers(event){
        let regex = /^[0-9]{1,10}$/;
        if(regex.test(event.target.value)===false && event.target.value !== ''){
            alert("Member count can only be number")
        }else {
            this.setState({
                localMembers: event.target.value,
                showInput: true
            })
        }
    }

    editMembersDone(){
        this.setState({
            showInput:false
        })
    }

    addMembers(){
      this.setState({
          showMembers:true,
          deleteMembers : false
      })
    }

    deleteMembersFunction(){
        this.setState({
            deleteMembers : true,
            showMembers : false
        })
    }

    deleteMembersDone(){
        this.setState({
            deleteMembers:false
        })
    }

    deleteTrip(){
        let rootRef = firebase.database().ref('trip/'+this.state.tripId);
        let billRef = firebase.database().ref().child('bill');
        let that = this;
        let localTrips = this.state.myTrips;

        localTrips.map((item,index)=>{
            if(item.tripName === this.state.trip){
                localTrips.splice(index,1)
            }
        });

       this.setState({
           myTrips : localTrips
       });

        alert(this.state.trip+" has been deleted ");

        rootRef.remove();
            billRef.orderByChild('id').equalTo(this.state.tripId).once('child_added',billSnap => {
                billRef.child(billSnap.key).remove();
                that.setState({
                    newTrip:'',
                    memberCount:'',
                    trip:'',
                    members:[],
                    viewExpense:false,
                    myImages:[],
                    tripId:'',
                    displayStorage:false,
                    showMembers : false,
                    localMembers : '',
                    deleteMembers : false,
                    showInput : false
                })
            });

    }

    render() {
        return (
            <div>
                <div className="navbar">
                    <a className="logo">SPLITWISE</a>
                    <img className="userImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC4Ammc_cwp2lqbkJQzf9r3NaiwdaVqjgka1B56cQuxqrA4D4b" alt="hehe"/>
                    <button className="signoutButton"
                            onClick={this.logOut.bind(this)}>LogOut</button>

                    <a className="links" href='/myExpense'>My Expense </a>
                    <a className="links" href='/'>My Home </a>
                    <a className="links" href='/gallery' >My Gallery </a>

                </div>

                <div className="navContainer">
                    <div>
                        <center><img className="friendsImage" src={this.props.photo} /></center>
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

                                        {
                                            this.state.displayStorage ?
                                                <button className="common-btn" onClick={this.deleteTrip.bind(this)}>Delete Trip</button> :
                                                ''
                                        }

                                        <input className="trip"
                                               type="text"
                                               placeholder="Enter new trip name or any event"
                                               name="trip"
                                               onChange={this.onChangeHandler.bind(this)}
                                               value={this.state.trip}/>
                                        {
                                            this.state.displayStorage ?
                                            <div className="delete-add-members">
                                                <button className="common-btn add-del-btn" onClick={this.addMembers.bind(this)}>Add members</button>
                                                <button className="common-btn add-del-btn" onClick={this.deleteMembersFunction.bind(this)}>Delete members</button>
                                            </div> :
                                            <div>
                                                <input className="trip"
                                                       type="text"
                                                       placeholder="Enter number of members"
                                                       name="memberCount"
                                                       onChange={(e) => this.onChangeHandler(e,"memberCount")}
                                                       value={this.state.memberCount}/>
                                                < TripMembers
                                                    memberCount={this.state.memberCount}
                                                    trip={this.state.trip}
                                                    tripId = {this.state.tripId}
                                                    user={this.props.user}
                                                    clearState={this.clearState} />
                                            </div>
                                        }
                                        {
                                            this.state.showMembers ?
                                                <div>
                                                    <input className="trip"
                                                           type="text"
                                                           placeholder="Enter number of members"
                                                           name="localMembers"
                                                           onChange={this.editMembers.bind(this)}
                                                           value={this.state.localMembers}
                                                    />
                                                    <OriginalMembers
                                                        trip={this.state.trip}
                                                        tripId = {this.state.tripId}
                                                        user={this.props.user}
                                                    />
                                                    {
                                                        this.state.showInput ?
                                                            <TripMembers
                                                                memberCount={this.state.localMembers}
                                                                trip={this.state.trip}
                                                                tripId = {this.state.tripId}
                                                                user={this.props.user}
                                                                clearState={this.clearState}
                                                                hasoriginalMembers = {this.state.showInput}
                                                                editMembersDone = {this.editMembersDone.bind(this)}
                                                            /> :
                                                            ''
                                                    }

                                                </div> :
                                                ''
                                        }
                                        {

                                            this.state.deleteMembers ?
                                                <div>
                                                    <OriginalMembers
                                                        trip={this.state.trip}
                                                        tripId = {this.state.tripId}
                                                        user={this.props.user}
                                                        deleteMembers={this.state.deleteMembers}
                                                        deleteMembersDone = {this.deleteMembersDone.bind(this)}
                                                    />
                                                </div> :
                                                ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <select className="dropdown trip-select-option" onChange={this.onChangeCategory.bind(this)} value={this.state.trip}>
                        <option value="Select Trip">Select Trip</option>
                        {this.state.myTrips.map((item,index)=>(
                            <option value={index} key={index}>{item.tripName}</option>
                        ))}
                    </select>

                </div>
                <Router>
                    <div className="home-content-wrapper">
                        <Route exact path="/" render={props => (<HomePage {...props}
                                                                          trip={this.state.trip}
                                                                          tripId = {this.state.tripId}
                                                                          user={this.props.user}/>)}/>

                        <Route exact path="/gallery" render={props => (<ViewGallery {...props}
                                                                                    trip={this.state.trip}
                                                                                    tripId = {this.state.tripId}
                                                                                    user={this.props.user}
                                                                                    myImages={this.state.myImages}/>)}/>
                        <Route exact path="/myExpense" render={props => (<ViewExpense {...props}
                                                                                      tripId = {this.state.tripId}
                                                                                      tripInfo={this.state.trip}
                                                                                      user={this.props.user}/>)}/>
                    </div>
                </Router>

            </div>
        );
    }
}

export default Home;

