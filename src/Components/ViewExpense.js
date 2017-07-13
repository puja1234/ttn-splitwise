import React, { Component } from 'react';
import Expense from './Expense'
import expense from '../Images/expenses.jpg'

class ViewExpense extends Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log('props in view expense----',this.props.tripInfo && this.props);
        let template;
        if(this.props.tripInfo == ''){
            template = (<div className="no-trip-selected"><img src={expense} alt="Expense Img"/></div>)
        }
        else{
            template = (<div>
                <Expense tripInfo={this.props.tripInfo}  user={this.props.user} tripId={this.props.tripId}/>
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