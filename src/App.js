import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
import Storage from './Components/Storage'
import Expense from './Components/Expense'
import Bill from './Components/Bill'

class App extends Component {
    constructor(){
        super();
        this.state = {
            userData:'',
            user:'',
            photo: '',
            trip:'',
            members:'',
            myImages:[]
        }
    }

    setUser = (user) => {
        this.setState({
            userData:user
        },() => {
            console.log('set user-----',this.state.userData);
            let userMail = this.state.userData.email;
            let userPhoto = this.state.userData.photoURL
            this.setState({
                user: userMail,
                photo: userPhoto
            })
        })
    }

    setTripData = (tripInfo) => {
        console.log('trip---------------',tripInfo);
        this.setState({
            trip:tripInfo.trip,
            members:tripInfo.members,
            user:tripInfo.user
        })
    }

    setGalleryData = (galleryInfo) => {
        this.setState({
            trip: galleryInfo.trip,
            user: galleryInfo.user,
            myImages: galleryInfo.myImages
        })
    }

    /*setExpenseData = () => {
        this.setState({

        })
    }*/

  render() {
    return (
        <div className="mainContainer">
            <Router>
                <div>
                    <Route exact path='/' render={props => (<Login {...props} fetchUser={this.setUser.bind(this)}/>)}/>
                    <Route path='/home' render={props => (<Home {...props}
                                                                user={this.state.user}
                                                                photo={this.state.photo}
                                                                fetchTripData={this.setTripData.bind(this)}
                                                                fetchGalleryData={this.setGalleryData.bind(this)}/>)}/>
                    <Route path='/gallery' render={props => (<Storage {...props}
                                                                      user={this.state.user}
                                                                      trip={this.state.trip}
                                                                      myImages={this.state.myImages}/>)}/>
                    <Route path='/expense' render={props => (<Expense {...props}
                                                                      user={this.state.user}
                                                                      trip={this.state.trip}
                                                                      members={this.state.members}
                                                                      fetchExpenseData={this.setTripData.bind(this)}/>)}/>
                    <Route path='/myExpense' render={props => (<Bill {...props}
                                                                     user={this.state.user}
                                                                     tripName={this.state.trip}
                                                                     members={this.state.members} />)}/>
                </div>
            </Router>
        </div>
    )}
}




export default App;
