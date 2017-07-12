import React, { Component } from 'react';
import '../App.css';
import SignUp from './SignUp'
import * as firebase from 'firebase'

class Login extends Component {
    constructor(){
        super();
        this.state={
            email:'',
            password:'',
            signUp :false,
            err:'',
        };
    }

    changeHandler=(event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    };

    login =() => {
        if(this.state.password === '' || this.state.email === ''){
            alert("fields cannot be empty");
        }
        else {
            const auth = firebase.auth();
            const promise = auth.signInWithEmailAndPassword(this.state.email, this.state.password);
            promise.catch(e => {
                this.setState({
                    err: 'You are not Registered!!! '
                })
            })
        }
    };

    signIn = () => {
        this.setState({
            signUp:true
        });
    };

    googleSignIn=()=> {
        let provider = new firebase.auth.GoogleAuthProvider();
        const promise = firebase.auth().signInWithRedirect(provider);
        promise.catch(e =>{
            console.log(e.message)
        })
    };

    render() {
        return (
            <div className="login">
                <div className="navbar">
                    <a className="logo">SPLITWISE</a>
                    <img className="userImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC4Ammc_cwp2lqbkJQzf9r3NaiwdaVqjgka1B56cQuxqrA4D4b" alt="hehe"/>
                </div>
                {
                    this.state.signUp ?
                        <SignUp />:
                        <div className="loginForm">
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
                                       onChange={this.changeHandler}
                                />
                                <div><label><b>Password</b></label></div>
                                <input type="password"
                                       className="pswdInput"
                                       placeholder="Enter Password"
                                       name="password"
                                       value={this.state.password}
                                       onChange={this.changeHandler}
                                />
                                <div className="login">
                                    <button className="loginButton" onClick={this.login}>Login</button>
                                    <button className="signInButton" onClick={this.signIn}>Sign Up</button>
                                    <button className="signInButton" onClick={this.googleSignIn}>Sign In with G+</button>
                                </div>
                            </div>
                        </div>
                }

            </div>
        );
    }
}

export default Login;