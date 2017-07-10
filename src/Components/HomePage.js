/**
 * Created by saubhagya on 9/7/17.
 */
import React, { Component } from 'react';
import '../App.css';
import Expense from './Expense'
import Bill from './Bill'

class HomePage extends Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log('this.props in HOmePage.js',this.props);
        let template;
        if(this.props.trip == ''){
            template = (<div>No trip selected yet</div>)
        }
        else{
            template = (
                <div>
                    <Expense tripInfo={this.props.trip}  user={this.props.user}/>
                    <Bill tripName={this.props.trip} user={this.props.user}/>
                </div>
            )
        }
        return(
            <div>
                {template}
            </div>
        );
    }
}

export default HomePage;