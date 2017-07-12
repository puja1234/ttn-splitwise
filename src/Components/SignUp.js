import React, { Component } from 'react';
import '../App.css';
import * as firebase from 'firebase'

class SignUp extends Component{
    constructor(){
        super();
        this.state ={
            email:'',
            password:'',
            password2:''
        }
    }

    register = () => {

        if(this.state.email === '' || this.state.password === '' || this.state.password2 === ''){
            alert("Fields cannot be empty");
        }else if(this.state.password !== this.state.password2){
            alert(" Passwords are not identical")
        }
        else {
            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password);
            promise.catch(e => {
                console.log(e.message);
                alert(e.message)
            });
        }
    };

    reset = () => {
        this.setState({
            email:'',
            password:'',
            password2:''
        })
    };

    changeHandler = (event) =>{
        this.setState({
            [event.target.name]:event.target.value
        })
    };

    render(){
        return(
            <div className="loginForm">
                <div className="imgcontainer">
                    <h2>Sign Up</h2>
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
                    <div><label><b>Confirm Password</b></label></div>
                    <input type="password"
                           className="pswdInput"
                           placeholder="Confirm Password"
                           name="password2"
                           value={this.state.password2}
                           onChange={this.changeHandler}
                    />
                    <div className="login">
                        <button className="loginButton" onClick={this.register}>Register</button>
                        <button className="loginButton" onClick={this.reset}>Reset</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp