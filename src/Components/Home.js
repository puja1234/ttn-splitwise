import React, { Component } from 'react';
import '../App.css';
import TripMembers from './TripMembers'
import * as firebase from 'firebase'
import HomePage from './HomePage'
import Expense from './Expense'
import Bill from './Bill'
import Storage from './Storage'
import OriginalMembers from './OriginalMembers'
import ViewGallery from './ViewGallery'
import ViewExpense from './ViewExpense'
import { BrowserRouter as Router, Route ,Link, Redirect} from 'react-router-dom'

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
            viewGallery:false,
            myImages:[],
            displayStorage:false,
            showMembers : false,
            localMembers : '',
            deleteMembers : false,
            showInput : false
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
            myTripLocal=[];
            let object1=snap.val();
            for(let key in object1){
                let obj=object1[key];
                if(obj.members.indexOf(by)!==-1){
                    myTripLocal.push(obj);
                }
            }

            this.setState({
                myTrips:myTripLocal
            })
        });
    }

    logOut(){
        firebase.auth().signOut();
        window.location.href='/'; //also tried <Redirect to='/'/> , but nothig happened.
    }

    onChangeHandler(event){
        this.setState({
            displayStorage:false,
            showMembers:false,
            viewExpense:false,
            deleteMembers : false,
            [event.target.name]: event.target.value
        });
    }

    onChangeCategory(event){
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
            let url = window.location.href;
            let addressUrl = url.substr(url.lastIndexOf('/'));
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
                console.log('trip---',this.state.trip);
               /* if(flag == 1){
                    let storageData = {
                        trip: this.state.trip,
                        myImages: this.state.myImages
                    }
                    /!*let expenseData = {
                        trip: this.state.trip
                    }*!/
                    console.log('data being send to app.js from home',storageData);
                    this.props.fetchData(storageData);
                    //this.props.fetchStorageData(storageData);
                    /!*this.props.fetchExpenseData(expenseData)*!/
                    flag = 0;
                }*/
                /*if( addressUrl == '/gallery'){
                    console.log('**********************url',addressUrl);
                    return <ViewGallery/>
                }
                else if( addressUrl == '/myExpense'){
                    console.log('**********************url',addressUrl);
                    return <Expense/>
                }
                else{
                    console.log('**********************url',addressUrl);
                    return <HomePage/>
                }*/

            })

        }

    }

    /*viewGallery = () => {
        this.setState({
            viewExpense:false,
            viewGallery: true
        },() => {
            let storageData = {
                trip: this.state.trip,
                tripImages: this.state.myImages
            }
            console.log('data being send to app.js from home',storageData);
            this.props.fetchStorageData(storageData);
        })
    }*/

    /*viewGallery = () => {
        let url = window.location.href;
        let addressUrl = url.substr(url.lastIndexOf('/'));
        console.log('%%%%%',addressUrl);

    }*/

    /*viewGallery = () => {
        let storageData = {
            trip:this.state.trip,
            myImages: this.state.myImages
        }
        this.props.fetchData(storageData);

    }*/

    clearState(){
        this.setState({
            trip:'',
            memberCount:''
        })
    }

    editMembers(event){
        this.setState({
            localMembers : event.target.value,
            showInput :true
        })
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

        let rootRef = firebase.database().ref().child('trip');
        let billRef = firebase.database().ref().child('bill');
        let tripKey ,billKey;
        let that = this;

        alert(this.state.trip+" has been deleted ");
        rootRef.orderByChild("tripName").equalTo(this.state.trip).once('child_added', function (snapshot) {
            tripKey = snapshot.key;
             rootRef.child(tripKey).remove();
            billRef.orderByChild('id').equalTo(tripKey).once('child_added',function (billSnap) {
                billKey = billSnap.key;
                billRef.child(billKey).remove();
            });
             that.setState({
                 newTrip:'',
                 memberCount:'',
                 trip:'',
                 myTrips:[],
                 tripInfo:'',
                 members:[],
                 viewExpense:false,
                 myImages:[],
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

                    <a className="links" href='/'> View Home </a>
                    <a className="links" href='/gallery' > View Gallery </a>
                    <a className="links" href='/myExpense'> View Expense </a>
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
                                                       onChange={this.onChangeHandler.bind(this)}
                                                       value={this.state.memberCount}/>
                                                < TripMembers
                                                    memberCount={this.state.memberCount}
                                                    trip={this.state.trip}
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
                                                        user={this.props.user}
                                                    />
                                                    {
                                                        this.state.showInput ?
                                                            <TripMembers
                                                                memberCount={this.state.localMembers}
                                                                trip={this.state.trip}
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
                        {this.state.myTrips.map((item)=>(
                            <option value={item.tripName}>{item.tripName}</option>
                        ))}
                    </select>
                   {/*{
                        this.state.displayStorage ?
                            <Storage trip={this.state.trip}
                                     user={this.props.user}
                                     myImages={this.state.myImages}/>
                            :
                            ''
                    }*/}


                </div>
                <Router>
                    <div>
                        <Route exact path="/" render={props => (<HomePage {...props}
                                                                    trip={this.state.trip}
                                                                    user={this.props.user}/>)}/>

                        <Route exact path="/gallery" render={props => (<ViewGallery {...props}
                                                                              trip={this.state.trip}
                                                                              user={this.props.user}
                                                                              myImages={this.state.myImages}/>)}/>
                        <Route exact path="/myExpense" render={props => (<ViewExpense {...props}
                                                                            tripInfo={this.state.trip}
                                                                            user={this.props.user}/>)}/>
                    </div>
                </Router>

               {/*{this.state.viewExpense ?
                    <div>
                        <Expense tripInfo={this.state.trip}  user={this.props.user}/>
                        <Bill tripName={this.state.trip} user={this.props.user}/>
                    </div>:''}*/}
            </div>
        );
    }
}

export default Home;
