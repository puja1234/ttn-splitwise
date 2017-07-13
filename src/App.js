import React, { Component } from 'react';
import * as firebase from 'firebase'
import Login from './Components/Login'
import Home from './Components/Home'
import Loader from './Components/Loader'
import './App.css'

class App extends Component {
    constructor(){
        super();
        this.state = {
            user:'',
            authStatusChecked : false,
        };

        firebase.auth().onAuthStateChanged(User => {
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
            if (result) {
                let user = result.user;
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
                        <Home user={this.state.user.email}
                              photo={this.state.photo}
                        />
                        :
                        <Login/> :
                    <Loader/>
                }
            </div>
        );
    }
}

export default App;
