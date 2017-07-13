import React, { Component } from 'react';
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
        let localMembers ,localTransaction ;
        let that= this;
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value',snap => {
            localMembers = snap.val().members;
            localTransaction = snap.val().transaction;
            for(let key in localTransaction) {
                if (localTransaction[key].transactioObject.generatedBill === false) {
                    this.setState({
                        displayButton: true
                    });
                    break;
                }
            }
            that.setState({
                tripTransactions: localTransaction,
                members: localMembers
            })
        });
    }

    componentWillReceiveProps(){
        let localMembers ,localTransaction ;
        let that= this;
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value',snap => {
            localMembers = snap.val().members;
            localTransaction = snap.val().transaction;
            for(let key in localTransaction) {
                if (localTransaction[key].transactioObject.generatedBill === false) {
                    this.setState({
                        displayButton: true
                    });
                    break;
                }
            }
            that.setState({
                tripTransactions: localTransaction,
                members: localMembers
            })
        });
    }

    generateBill = () => {
        let trip=this.props.tripName;
        let user = this.props.user;
        let transactions =[];
        let totalAmount = 0;
        let rootRef = firebase.database().ref('trip/'+this.props.tripId+'/transaction');

        this.setState({
            displayButton:false
        });

        var updateGeneratedBill = function (snap) {
            console.log(snap.val());
            if(snap.val().transactioObject.generatedBill === false){
                totalAmount += parseInt(snap.val().transactioObject.amount);
                transactions.push(snap.val().transactioObject);
                snap.ref.child('transactioObject').update({generatedBill : true})
            }
        };

        //update generatedBill to true and add amount
        rootRef.on('child_added', updateGeneratedBill);
        rootRef.off('child_added', updateGeneratedBill);

        //update bill table add bills to it
        if(totalAmount){
            console.log("total amount",totalAmount)
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

       let billRef = firebase.database().ref().child('bill');
       billRef.orderByChild("id").equalTo(this.props.tripId).on('child_added', function (billSnap) {
           if (billSnap.val().hasOwnProperty('bills')) {
               let billPush = billSnap.ref.child('bills').push();
               billPush.set({accounts,generatedDate:Date.now()})
           } else {
               billSnap.ref.update({bills: []});
               billSnap.ref.child('bills').push({accounts,generatedDate:moment().format()});
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
                <GeneratedBill user={this.props.user} tripName={this.props.tripName} tripId={this.props.tripId}/>
            </div>
        );
    }
}

export default Bill;
