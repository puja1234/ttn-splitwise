import React, { Component } from 'react';
import '../App.css';
import Home from './Home'
import * as firebase from 'firebase'

class Login extends Component {
    constructor(){
        super();
        this.state={
            email:'',
            password:'',

            err:'',
        };
    }

    changeHandler(event){
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    login() {
        if(this.state.password === '' || this.state.email === ''){
            alert("fields cannot be empty");
        }
        else {
            const auth = firebase.auth();
            const promise = auth.signInWithEmailAndPassword(this.state.email, this.state.password);
            promise/*.then(
                firebase.auth().onAuthStateChanged(User => {
                    if (User) {
                        this.setState({
                            user: User
                        });
                    } else {
                        this.setState({
                            user: ''
                        })
                    }
                })
            )*/.catch(e => {
                this.setState({
                    err: 'You are not Registered!!! '
                })
            })
        }
    }

    signIn() {
        if (this.state.password === '' || this.state.email === '') {
            alert("Fields cannot be empty");
        } else {
            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password);
            promise.catch(e => {
                console.log(e.message)
            });

            /* firebase.auth().onAuthStateChanged(User => {
             if (User) {
             this.setState({
             user: User
             });
             } else {
             this.setState({
             user: ''
             })
             }
             })
             }*/
        }

    }
    googleSignIn(){
        let provider = new firebase.auth.GoogleAuthProvider();
         const promise = firebase.auth().signInWithRedirect(provider);
         promise.catch(e =>{
             console.log(e.message)
         })/*.then(function(result) {
            console.log("user :",result)
        }).catch(function (error) {
            console.log(error);
        });*/

       /* firebase.auth().onAuthStateChanged(User => {
            if(User){
                this.setState({
                    user:User,
                  photo:User.providerData[0].photoURL
                });
            }else{
                this.setState({
                    user:''
                })
            }
        })*/

    }

    render() {
        return (
            <div className="login">
                <div className="navbar">
                    <a className="logo">SPLITWISE</a>
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
