import React, { Component } from 'react';
import '../App.css';
import TripMembers from './TripMembers'
import * as firebase from 'firebase'
import Expense from './Expense'
import Bill from './Bill'

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
           viewExpense:false
       }
    }

    componentWillMount(){
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
                console.log("Object is:",obj);
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

    onChangeCategory(event){
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
                                               name="newTrip"
                                               onChange={this.onChangeHandler.bind(this)}
                                               value={this.state.newTrip}/>
                                        <input className="trip"
                                               type="text"
                                               placeholder="Enter number of members"
                                               name="memberCount"
                                               onChange={this.onChangeHandler.bind(this)}
                                               value={this.state.memberCount}/>
                                        <TripMembers memberCount={this.state.memberCount} trip={this.state.newTrip} user={this.props.user}/>
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
