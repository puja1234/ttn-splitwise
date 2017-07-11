import React, { Component } from 'react';
import '../App.css';
import * as firebase from 'firebase'
import GeneratedBill from './GeneratedBill'
import moment from 'moment'

class Bill extends Component {

    constructor(props){
        super(props);
        this.state ={
            displayButton:false,
            tripTransactions:'',
            displayBill:false,
            members:''
        }
    }

    componentDidMount(){
        let tripName = this.props.tripName;
        let localMembers ;
        let localTransaction ;
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild('tripName').equalTo(tripName).once('value',snap => {
            for(let key in snap.val()){
                if (snap.val()[key].members.indexOf(this.props.user) !== -1) {
                    localMembers = snap.val()[key].members;
                    localTransaction = snap.val()[key].transaction;
                }
            }
            if(localTransaction) {
                this.setState({
                    tripTransactions: localTransaction,
                    members: localMembers
                }, () => {
                    for (let key in this.state.tripTransactions) {
                        if (this.state.tripTransactions.hasOwnProperty(key)) {
                            if (this.state.tripTransactions[key].transactioObject.generatedBill === false) {
                                this.setState({
                                    displayButton: true
                                });
                                break;
                            }
                        }
                    }
                });
            }

        });
    }

    componentWillReceiveProps(){
        let tripName = this.props.tripName;
        let localMembers ;
        let localTransaction ;
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild('tripName').equalTo(tripName).once('value',snap => {
            for(let key in snap.val()){
                if (snap.val()[key].members.indexOf(this.props.user) !== -1) {
                    localMembers = snap.val()[key].members;
                    localTransaction = snap.val()[key].transaction;
                }
            }

            if(localTransaction) {
                this.setState({
                    tripTransactions: localTransaction,
                    members: localMembers
                }, () => {
                    for (let key in this.state.tripTransactions) {
                        if (this.state.tripTransactions.hasOwnProperty(key)) {
                            if (this.state.tripTransactions[key].transactioObject.generatedBill === false) {
                                this.setState({
                                    displayButton: true
                                });
                                break;
                            }
                        }
                    }
                });
            }
        });
    }

    generateBill = () => {
        let trip=this.props.tripName;
        let user = this.props.user;
        let transactions =[];
        let totalAmount = 0;
        let rootRef = firebase.database().ref().child('trip');

        this.setState({
            displayButton:false
        });

        var updateGeneratedBill = function (snap) {
            var checkBillStatus = function (transSnap) {  // run number of transaction times
                if(transSnap.val().transactioObject.generatedBill === false){
                    totalAmount += parseInt(transSnap.val().transactioObject.amount);
                    rootRef.child(snap.key).child('transaction').child(transSnap.key).child('transactioObject').child('generatedBill').on('value',function (trans) { //run once for each transaction
                        if(trans.val() === false){
                            transactions.push(transSnap.val().transactioObject);
                        }

                        let ref = rootRef.child(snap.key).child('transaction').child(transSnap.key).child('transactioObject');
                        ref.update({generatedBill:true})
                    })
                }
            };

            if(snap.val().members.indexOf(user) !== -1){ // run single time
                rootRef.child(snap.key).child('transaction').on('child_added', checkBillStatus);
                rootRef.child(snap.key).child('transaction').off('child_added', checkBillStatus);
            }
        };


        //update generatedBill to true and add amount
        rootRef.orderByChild('tripName').equalTo(trip).on('child_added', updateGeneratedBill);
        rootRef.orderByChild('tripName').equalTo(trip).off('child_added', updateGeneratedBill);


        //update bill table add bills to it
        if(totalAmount){
            this.addBill(transactions,totalAmount);
        }

        this.setState({
            displayBill:true,
            displayButton:false
        })

    };

   addBill(transactions,totalAmount){
        let trip=this.props.tripName;
        let user = this.props.user;
        let share = totalAmount/this.state.members.length;
        let debitor =[];
        let creditor =[];

        let found = true;
        let  members = this.state.members;
        let k = 0;
        for(k=0;k<members.length;k++){
            if(found === false){
                debitor.push({name:members[k-1],amount:share})
            }
            found = false;
            for(let key in transactions){
                if(members[k] === transactions[key].spend_by){
                    found = true;
                    break;
                }else{
                    found = false
                }
            }
        }

        if(found === false){
            debitor.push({name:members[k-1],amount:share})
        }


        for(let key in transactions){
            if(transactions[key].amount - share < 0){
                debitor.push({name:transactions[key].spend_by,amount:-(transactions[key].amount-share)})
            }else if(transactions[key].amount - share > 0){
                creditor.push({name:transactions[key].spend_by,amount:transactions[key].amount-share})
            }
        }


        let status = 'pending';
        let accounts = [], i = 0, j = 0;
        while( i < creditor.length && j < debitor.length){
            if(creditor[i].amount < debitor[j].amount){
                debitor[j].amount = debitor[j].amount - creditor[i].amount;
                accounts.push({
                    debitor: debitor[j].name,
                    creditor: creditor[i].name,
                    amount: creditor[i].amount,
                    status: status
                });
                creditor[i]=0;
                i++;
            } else {
                creditor[i].amount = creditor[i].amount - debitor[j].amount;
                accounts.push({
                    debitor: debitor[j].name,
                    creditor: creditor[i].name,
                    amount: debitor[j].amount,
                    status : status
                });
                debitor[j]=0;
                j++;
            }
        }
        let rootRef = firebase.database().ref('trip');

        rootRef.orderByChild('tripName').equalTo(trip).on('child_added',function (snap) {
            if(snap.val().members.indexOf(user) !== -1){
                let key = snap.key;
                let billRef = firebase.database().ref().child('bill');
                billRef.orderByChild("id").equalTo(key).on('child_added', function (billSnap) {
                    if (billSnap.val().hasOwnProperty('bills')) {
                        let billPush = billSnap.ref.child('bills').push();
                        billPush.set({accounts,generatedDate:Date.now()})
                    } else {
                        billSnap.ref.update({bills: []});
                        billSnap.ref.child('bills').push({accounts,generatedDate:moment().format()});
                    }
                });
            }
        });
        this.setState({
            displayBill:true
        })
    }

    render() {
        return (
            <div className="totalExpense">
                <div className="myExpenses">My Expense</div>
                {this.state.displayButton ?
                    <button onClick={this.generateBill}>Generate Bill</button>:
                    ''
                }
                <GeneratedBill user={this.props.user} tripName={this.props.tripName}/>
            </div>
        );
    }
}

export default Bill;
