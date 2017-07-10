import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
import Loader from './Components/Loader'
import ViewGallery from './Components/ViewGallery'
import HomePage from './Components/HomePage'
import Storage from './Components/Storage'
import Expense from './Components/Expense'

class App extends Component {
    constructor(){
        super();
        this.state = {
            user:'',
            authStatusChecked : false,
            /*trip:'',
            myImages:[]*/
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
                //console.log("User is :",user.email,user.providerData[0].photoURL);
                that.setState({
                    user:user,
                    photo:user.providerData[0].photoURL
                });
            }
        }).catch(function(error) {
            console.log("redirect error:", error);
        });
    }

   /* setStorageData = (storageData) => {
        console.log('@@@@@@@@@@@@@@@@@@',storageData);
        this.setState({
            trip: storageData.trip,
            myImages: storageData.tripImages
        },() => {
            console.log('#####################3',this.state.user.email);
        })
    }*/

    /*setExpenseData = (expenseData) => {
        this.setState({
            trip: expenseData.trip,
            user: expenseData.user
        })
    }*/

    /*setData = (reqData) => {
        this.setState({
            trip:reqData.trip,
            myImages: reqData.myImages
        })
    }*/

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

//{/*fetchExpenseData = {this.setExpenseData.bind(this)}*/}
/*this.state.trip?
 this.state.myImages?
 <Storage user={this.state.user.email}
 trip={this.state.trip}
 myImage={this.state.myImages}/>
 :
 <Expense user={this.state.user.email}
 tripInfo={this.state.trip}/>
 :*/
/*
<Router>
    <div>
        <Route path='/home/gallery' render={props => (<Storage {...props}
                                                               user={this.state.user.email}
                                                               trip={this.state.trip}
                                                               myImages={this.state.myImages}/>)}/>
        <Route path='/home/myExpense' render={props => (<Expense {...props}
                                                                 user={this.state.user.email}
                                                                 tripInfo={this.state.trip}/>)}/>
    </div>
</Router>*/


/*
<Router>
    <div>
        <Route path="/gallery" render={props => (<ViewGallery {...props}
                                                              user={this.state.user.email}
                                                              trip={this.state.trip}
                                                              myImages={this.state.myImages}/>)}/>
    </div>
</Router>*/


//fetchStorageData = {this.setStorageData.bind(this)}