import React, { Component } from 'react';
import '../App.css';

class TransactionTable extends Component {
    constructor(){
        super();
        this.state={
            edit:false
        }
    }

    editTransaction(item){
        this.setState({
            edit:true
        })
    }

    deleteTransaction(item){

    }

    render(){

        let item = this.props.item;
        return(
            <div className="expenseTable">{
                this.state.edit ?
                    <tr>
                        <input type="text" value={item.spend_by} />
                        <input type="text" value={item.title}/>
                        <input type="text" value={item.amount}/>
                        <td><button>Save</button></td>
                    </tr>:

                       <tr>
                            <td>{item.spend_by}</td>
                            <td>{item.title}</td>
                            <td>{item.amount}</td>
                            <td><button onClick={this.deleteTransaction.bind(this,item)}>Delete</button></td>
                        </tr>
                }
            </div>
        )
    }
}

export default TransactionTable;