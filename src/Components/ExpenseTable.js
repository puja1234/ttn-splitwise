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
            edit:false
        }
    }

    componentDidMount(){
        let tripName = this.props.tripName;
        let localKey;
        console.log("inside table component :",tripName);
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(tripName).on('value', snap => {
            this.setState({
                trans:snap.val()
            },()=>{
                console.log("inside table :",this.state.trans);
                for(let key in this.state.trans){
                    if(this.state.trans.hasOwnProperty(key)) {
                        if (this.state.trans[key].members.indexOf(this.props.user) !== -1) {
                            console.log("has property :", this.state.trans[key].transaction);
                            this.setState({
                                trans2: this.state.trans[key].transaction
                            }, () => {
                                console.log("inside table component :", this.state.trans2)

                            })
                        }
                    }
                }
            });



        });
    }

    componentWillReceiveProps(){
        let tripName = this.props.tripName;
        let localKey;
        console.log("inside table component :",tripName)
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(tripName).on('value', snap => {
            this.setState({
                trans:snap.val()
            },()=>{
                console.log("inside table :",this.state.trans)
                for(let key in this.state.trans){
                    if(this.state.trans.hasOwnProperty(key)) {
                        if (this.state.trans[key].members.indexOf(this.props.user) !== -1) {
                            localKey = snap.key;
                            console.log("has property :", this.state.trans[key].transaction);
                            this.setState({
                                trans2: this.state.trans[key].transaction
                            }, () => {
                                console.log("inside table component :", this.state.trans2)

                            })
                        }
                    }
                }
                this.setState({
                    transKey : localKey
                })
            });



        });
    }

    deleteTransaction(transactionReceived){
        let that = this;
        let transKey;
        console.log("transaction to be deleted is:",transactionReceived);
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild('tripName').equalTo(this.props.tripName).once('child_added',function (snap) {
            if(snap.val().members.indexOf(that.props.user) !== -1){
                transKey = snap.key;
            }
        });
        rootRef.child(transKey).child('transaction').on('child_added',(snap)=>{
            console.log("snap is:",snap.val());
            if(snap.val().transactioObject.amount === transactionReceived.amount && snap.val().transactioObject.spend_by === transactionReceived.spend_by && snap.val().transactioObject.title === transactionReceived.title && snap.val().transactioObject.generatedBill===false) {
               rootRef.child(transKey).child('transaction').child(snap.key).remove();
            }
        })
    }

    editTransaction(){
        this.setState({
            edit:true
        })
    }

    updateTransaction(prevTrans,newTrans){
        console.log("change ",prevTrans," to ",newTrans);
        let that = this;
        let transKey;
        console.log("transaction to be deleted is:",prevTrans);
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild('tripName').equalTo(this.props.tripName).once('child_added',function (snap) {
            if(snap.val().members.indexOf(that.props.user) !== -1){
                transKey = snap.key;
            }
        });
        rootRef.child(transKey).child('transaction').on('child_added',(snap)=>{
            console.log("snap is:",snap.val());
            if(snap.val().transactioObject.amount === prevTrans.amount && snap.val().transactioObject.spend_by === prevTrans.spend_by && snap.val().transactioObject.title === prevTrans.title && snap.val().transactioObject.generatedBill===false) {
                console.log("update",snap.key,snap.val().transactioObject);
                rootRef.child(transKey).child('transaction').child(snap.key).child('transactioObject').update({amount:newTrans.amount,generatedBill:false,spend_by:newTrans.spend_by,title:newTrans.title})
            }
        });
        this.setState({
            edit:false
        })
    }

    render() {
        let expenditures =[];
        let index=0;
        for (let key in this.state.trans2) {
            if (this.state.trans2.hasOwnProperty(key) ) {
                expenditures.push(this.state.trans2[key].transactioObject);
            }
        }

        return (
            <div className="expense">
                <table >
                    <thead>
                        <tr>
                            <th>Expense By</th>
                            <th>Item</th>
                            <th>Amount</th>
                        </tr>
                    </thead>

                    {expenditures.map((item)=> {
                        if(item.trip === this.props.tripTo){
                            return(
                                <div >{
                                    item.generatedBill ?
                                        <tr>
                                            <td>{item.spend_by}</td>
                                            <td>{item.title}</td>
                                            <td>{item.amount}</td>
                                        </tr> :
                                        this.state.edit ?
                                            <Edit transInfo = {item} updateTransaction ={this.updateTransaction.bind(this)}/> :
                                        <tr>
                                            <td>{item.spend_by}</td>
                                            <td>{item.title}</td>
                                            <td>{item.amount}</td>
                                            <td><button className="common-btn" onClick={this.deleteTransaction.bind(this,item)}>Delete</button></td>
                                            <td><button className="common-btn" onClick={this.editTransaction.bind(this,item)}>Edit</button></td>
                                        </tr>
                                    }
                                </div>
                            )

                        }
                    })
                    }
                </table>
            </div>
        );
    }
}

export default ExpenseTable;
