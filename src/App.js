import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import Login from './Components/Login'
import Home from './Components/Home'
import Loader from './Components/Loader'

class App extends Component {
    constructor(){
        super();
        this.state = {
            user:'',
            authStatusChecked : false
        };

        firebase.auth().onAuthStateChanged(User => {
            console.log("On auth state changed");
            if(User){
                this.setState({
                    user:User,
                    photo:User.providerData[0].photoURL,
                    authStatusChecked:true
                });

            }else{
                this.setState({
                    user:'',
                    authStatusChecked:true
                })
            }
        });

        let that=this;
        firebase.auth().getRedirectResult().then(function(result) {
            console.log("redirected url");
            if (result) {
                var user = result.user;
                console.log("User is :",user.email,user.providerData[0].photoURL);
                that.setState({
                    user:user,
                    photo:user.providerData[0].photoURL
                });
            }
        }).catch(function(error) {
            console.log("redirect error:", error);
        });
    }


  render() {
    return (
        <div className="mainContainer">
            {this.state.authStatusChecked ?
                this.state.user ?
                    <Home user={this.state.user.email} photo={this.state.photo}/>
                    :
                    <Login/> :
                <Loader/>
            }
        </div>
    );
  }
}

export default App;
