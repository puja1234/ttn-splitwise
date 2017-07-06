/**
 * Created by saubhagya on 4/7/17.
 */

import React, { Component } from 'react';
import '../App.css';

class TopNavBar extends Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log('!!!!!!!!!!!!!!!!!!',this.props);
        return(
            <div>

                <div className="navbar">
                    <div className="logo">SPLITWISE</div>
                    <div className="tab-links">
                        <a href="/home">Home</a>
                        <a href="/gallery">Gallery</a>
                        <a href="/expense">Expenses</a>
                        <a href="/myExpense">My Expenses</a>
                    </div>
                    <img className="userImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC4Ammc_cwp2lqbkJQzf9r3NaiwdaVqjgka1B56cQuxqrA4D4b" alt="hehe"/>
                </div>
            </div>
        );
    }
}

export default TopNavBar;