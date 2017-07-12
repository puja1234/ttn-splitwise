import React, { Component } from 'react';
import '../App.css';
import TransactionTable from './TransactionTable'
import Edit from './Edit'
import * as firebase from 'firebase'

class ExpenseTable extends Component {
    constructor(props){
        super(props);
        this.state={
           trans:'',
            trans2:'',
            edit:false,
            myMembers:'',
        }
    }

    componentDidMount(){
        let tripName = this.props.tripName;
        console.log("inside table component :",tripName);
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value' , snap=>{
            this.setState({
                trans2: snap.val().transaction,
                myMembers : snap.val().members
            }, () => {
                console.log("inside table component :", this.state.trans2)
            })
        });
    }

    componentWillReceiveProps(){
        let tripName = this.props.tripName;
        console.log("inside table component :",tripName);
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value' , snap=>{
            this.setState({
                trans2: snap.val().transaction,
                myMembers : snap.val().members,
                transKey:this.props.tripId
            }, () => {
                console.log("inside table component :", this.state.trans2)
            })
        });
    }

    deleteTransaction(transactionReceived){
        console.log("transaction to be deleted is:",transactionReceived);
        let rootRef = firebase.database().ref('trip/'+this.props.tripId+'/transaction');

        rootRef.on('child_added',(snap)=>{
            if(snap.val().transactioObject.amount === transactionReceived.amount && snap.val().transactioObject.spend_by === transactionReceived.spend_by && snap.val().transactioObject.title === transactionReceived.title && snap.val().transactioObject.generatedBill===false) {
               rootRef.child(snap.key).remove();
            }
        })
    }

    editTransaction(){
        this.setState({
            edit:true
        })
    }

    updateTransaction(prevTrans,newTrans){
        let rootRef = firebase.database().ref('trip/'+this.props.tripId+'/transaction');

        rootRef.on('child_added',(snap)=>{
            if(snap.val().transactioObject.amount === prevTrans.amount && snap.val().transactioObject.spend_by === prevTrans.spend_by && snap.val().transactioObject.title === prevTrans.title && snap.val().transactioObject.generatedBill===false) {
                rootRef.child(snap.key).child('transactioObject').update({amount:newTrans.amount,generatedBill:false,spend_by:newTrans.spend_by,title:newTrans.title})
            }
            this.setState({
                edit:false
            })
        });
    }

    render() {
        let expenditures =[];
        let index=0;
        for (let key in this.state.trans2) {
            if (this.state.trans2.hasOwnProperty(key) ) {
                expenditures.push(this.state.trans2[key].transactioObject);
                }
        }
        let expensesData = expenditures.map((item)=> {
            if(item.trip === this.props.tripTo) {
                if (item.generatedBill) {
                    return (
                        <tr>
                            <td>{item.spend_by}</td>
                            <td>{item.title}</td>
                            <td>{item.amount}</td>
                            <td>{item.createdAt.slice(0, item.createdAt.indexOf('T'))}</td>
                        </tr>
                    );
                } else {
                    if (this.state.edit) {
                        return (
                            <Edit transInfo={item} myMembers={this.state.myMembers}
                                  updateTransaction={this.updateTransaction.bind(this)}/>
                        )

                    } else {
                        return(
                            <tr>
                                <td>{item.spend_by}</td>
                                <td>{item.title}</td>
                                <td>{item.amount}</td>
                                <td>{item.createdAt.slice(0, item.createdAt.indexOf('T'))}</td>
                                <td>
                                    <button className="common-btn" onClick={this.deleteTransaction.bind(this, item)}>Delete</button>

                                    <button className="common-btn" onClick={this.editTransaction.bind(this, item)}>Edit</button>
                                </td>
                            </tr>
                        )
                    }
                }
            }
        });

        return (
            <div className="expense">
                <table >
                    <thead>
                        <tr>
                            <th>Expense By</th>
                            <th>Item</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {expensesData}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ExpenseTable;
