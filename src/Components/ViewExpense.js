/**
 * Created by saubhagya on 9/7/17.
 */
import React, { Component } from 'react';
import '../App.css';
import Expense from './Expense'

class ViewExpense extends Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log('props in view expense----',this.props.tripInfo && this.props);
        let template;
        if(this.props.tripInfo == ''){
            template = (<div>no trip is selected</div>)
        }
        else{
            template = (<div>
                <Expense tripInfo={this.props.tripInfo}  user={this.props.user}/>
            </div>)
        }
        return(
            <div>
                {template}
            </div>
        );
    }
}

export default ViewExpense;