import React, { Component } from 'react';
import '../App.css';
import TripMembers from './TripMembers'
import * as firebase from 'firebase'

class Home extends Component {
    constructor(){
        super();
       this.state={
           newTrip:'',
           memberCount:'',
           trip:'',
           myTrips:''
       }
    }

    componentWillMount(){
        let by=this.props.user;
        let rootRef = firebase.database().ref().child('trip');
        let memberRef = rootRef.child('members');
        memberRef.orderByChild("members").equalTo(by).on('value', snap => {
            this.setState({
                myTrips:snap.val()
            },()=>{
                console.log('*******mytrip',this.state.myTrips);
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
        this.setState({
            trip:event.target.value
        })
    }


    render() {
        return (
            <div>
                <div className="navContainer">
                    <div>
                        <center><img className="friendsImage" src={this.props.photo} alt="https://en.opensuse.org/images/0/0b/Icon-user.png"/></center>
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
                                               placeholder="Enter new trip name"
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


                    <select className="dropdown" onChange={this.onChangeCategory.bind(this)}>
                        <option value="Activity">Select Trip</option>
                        <option value="Lost and Found">Lost and Found</option>
                    </select>



                    <button className="signInButton" onClick={this.logOut.bind(this)}>LogOut</button>
                </div>

            </div>
        );
    }
}

export default Home;
