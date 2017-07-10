/**
 * Created by saubhagya on 9/7/17.
 */
import React, { Component } from 'react';
import '../App.css';

class TopNavBar extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <div className="navbar">
                    <a className="logo">SPLITWISE</a>
                    <img className="userImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC4Ammc_cwp2lqbkJQzf9r3NaiwdaVqjgka1B56cQuxqrA4D4b" alt="hehe"/>
                    <button className="signoutButton"
                            onClick={this.logOut.bind(this)}>LogOut</button>
                    <a className="links" href='/gallery' onClick={this.viewGallery.bind(this)}> View Gallery </a>
                    <a className="links" href='/home/myExpense'> View Expense </a>
                </div>
            </div>
        );
    }
}