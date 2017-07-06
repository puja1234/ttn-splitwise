import React, { Component } from 'react';
import '../App.css';
import Home from './Home'
import * as firebase from 'firebase'
//import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import mushroom from './../Images/mushroom.jpg'

class Login extends Component {
    constructor(){
        super();
        this.state={
            email:'',
            password:'',
            /*user:'',*/
            err:'',
            photo:''
        }
    }

    changeHandler(event){
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    login() {
        let user_auth;
        if(this.state.password === '' || this.state.email === ''){
            alert("fields cannot be empty");
        }
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(this.state.email, this.state.password);
        promise.then(
            (result) => {
                console.log('*********login with login button------',result);
                user_auth = result;
                this.props.fetchUser(result);
                this.props.history.push({
                    pathname: '/home',
                })

            }).catch(e=>{
            this.setState({
                err:'You are not Registered!!! '
            })
        });
            firebase.auth().onAuthStateChanged(User => {
                if (User) {
                    console.log('User-------------login-----',User);
                }
            })
        /*).catch(e=>{
            this.setState({
                err:'You are not Registered!!! '
            })
        })*/
        /*this.setState({
            email:'',
            password:''
        })*/
    }

    signIn(){
        if(this.state.password === '' || this.state.email === ''){
            alert("Fields cannot be empty");
        }else {
            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password);
            promise.then(
                (result) => {
                    console.log('*********login with sign up button------',result);
                    this.props.fetchUser(result);
                    this.props.history.push({
                        pathname: '/home',
                    })

                }
            ).catch(e => {
                console.log(e.message)
            });

            firebase.auth().onAuthStateChanged(User => {
                if (User) {
                    console.log('**********user sfter sign up-----------',User);
                    /*this.setState({
                        user: User
                    }/!*,function(){
                        if(this.state.photo === ''){
                            this.setState({
                                photo:{mushroom}
                            })
                        }
                    }*!/);*/
                }
                /*else {
                    this.setState({
                        user: ''
                    })
                }*/
            })
            /*this.setState({
                email:'',
                password:''
            })*/
        }
    }

    googleSignIn(){
        let user_auth;
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            // var token = result.credential.accessToken;
            user_auth = result.user;
            //console.log('user data----------',user_auth);
            console.log("user :",user_auth.providerData[0].photoURL)

            /*----------------to push data into path /home when user is authenticated.... But here
            *   you can't pass object in state as an error occures i.e. object cannot be cloned.....*/
            this.props.fetchUser(result.user);
            this.props.history.push({
                pathname: '/home',
                state: { a : 1},
            })

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorCode);
            console.log(errorMessage);
        });

        firebase.auth().onAuthStateChanged(User => {
            if(User){
                console.log(User, '-------------')
            }
        })

    }

    render() {
        console.log(this.props, '---------')
        return (
            <div className="login">
                <div className="navbar">
                    <div className="logo">SPLITWISE</div>
                    <img className="userImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC4Ammc_cwp2lqbkJQzf9r3NaiwdaVqjgka1B56cQuxqrA4D4b" alt="hehe"/>
                </div>
                <div className="loginForm">
                    {this.state.err}
                    <div className="imgcontainer">
                        <img src="https://en.opensuse.org/images/0/0b/Icon-user.png" alt="Avatar" className="avatar"/>
                    </div>
                    <div className="container">
                        <div><label><b>Username</b></label></div>
                        <input className="emailInput"
                               type="text"
                               placeholder="Enter email"
                               name="email"
                               value={this.state.email}
                               onChange={this.changeHandler.bind(this)}
                        />
                        <div><label><b>Password</b></label></div>
                        <input type="password"
                               className="pswdInput"
                               placeholder="Enter Password"
                               name="password"
                               value={this.state.password}
                               onChange={this.changeHandler.bind(this)}
                        />
                        <div className="login">
                            <button className="loginButton" onClick={this.login.bind(this)}>Login</button>
                            <button className="signInButton" onClick={this.signIn.bind(this)}>Sign In</button>
                            <button className="signInButton" onClick={this.googleSignIn.bind(this)}>Sign In with G+</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
