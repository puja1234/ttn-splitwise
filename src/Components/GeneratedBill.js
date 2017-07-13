import React, { Component } from 'react';
import * as firebase from 'firebase'

class GeneratedBill extends Component {
    constructor(){
        super();
        this.state = {
            trans:'',
            debitor:[],
            creditor:[]
        }
    }
    componentDidMount(){
        let usersDebit =[] , userdCredit =[];
        let billRef  = firebase.database().ref().child('bill');
        billRef.orderByChild('id').equalTo(this.props.tripId).on('child_added',billSnap =>{
            for(let key in billSnap.val().bills){
                if (billSnap.val().bills[key].accounts !== undefined) {
                    for (let i = 0; i < billSnap.val().bills[key].accounts.length; i++) {
                        if (billSnap.val().bills[key].accounts[i] === undefined) {
                            i++;
                        }
                        if (billSnap.val().bills[key].accounts[i].debitor === this.props.user && billSnap.val().bills[key].accounts[i].status === 'pending') {
                            usersDebit.push(billSnap.val().bills[key].accounts[i]);
                        } else if (billSnap.val().bills[key].accounts[i].creditor === this.props.user && billSnap.val().bills[key].accounts[i].status === 'pending') {
                            userdCredit.push(billSnap.val().bills[key].accounts[i]);
                        }
                    }
                }
            }

            this.setState({
                debitor:usersDebit,
                creditor:userdCredit
            },()=>{
                console.log("**********",this.state.debitor,this.state.creditor)
            })
        });
        }

    componentWillReceiveProps(){
        let usersDebit =[] , userdCredit =[];
        let billRef  = firebase.database().ref().child('bill');
        billRef.orderByChild('id').equalTo(this.props.tripId).on('child_added',billSnap =>{
            for(let key in billSnap.val().bills){
                if (billSnap.val().bills[key].accounts !== undefined) {
                    for (let i = 0; i < billSnap.val().bills[key].accounts.length; i++) {
                        if (billSnap.val().bills[key].accounts[i] === undefined) {
                            i++;
                        }
                        if (billSnap.val().bills[key].accounts[i].debitor === this.props.user && billSnap.val().bills[key].accounts[i].status === 'pending') {
                            usersDebit.push(billSnap.val().bills[key].accounts[i]);
                        } else if (billSnap.val().bills[key].accounts[i].creditor === this.props.user && billSnap.val().bills[key].accounts[i].status === 'pending') {
                            userdCredit.push(billSnap.val().bills[key].accounts[i]);
                        }
                    }
                }
            }

            this.setState({
                debitor:usersDebit,
                creditor:userdCredit
            },()=>{
                console.log("**********",this.state.debitor,this.state.creditor)
            })
        });

    }

    payAmount(item){
        // console.log("inside pay amount " ,item,this.state.tripID)
        var parentKey , childKey ;
        let rootRef = firebase.database().ref().child('bill');

        var updateStatus = function (snap) {
            if(snap.val().creditor === item.creditor && snap.val().debitor === item.debitor && snap.val().amount === item.amount && snap.val().status === 'pending') {
                console.log("Finally got ir", snap.val());
               let ref = rootRef.child(parentKey).child('bills').child(childKey).child('accounts').child(snap.key)
                ref.update({status : 'done'})
            }
        };

        var fetchAccounts = function (snap) {
            console.log("accounts are :", snap.val());
            for (let i = 0; i < snap.val().length; i++) {
                rootRef.child(parentKey).child('bills').child(childKey).child('accounts').on("child_added", updateStatus)
                rootRef.child(parentKey).child('bills').child(childKey).child('accounts').off("child_added", updateStatus)
            }
        }


        var billFetch2 = function (snap) {
            console.log("each bill :",snap.val());
            childKey = snap.key;
            rootRef.child(parentKey).child('bills').child(childKey).on("child_added",fetchAccounts)
            rootRef.child(parentKey).child('bills').child(childKey).off("child_added",fetchAccounts)
        };

        var fetchBill = function (snap) {
            console.log("pay button clicked :",snap.val().bills);
            parentKey = snap.key;
            rootRef.child(parentKey).child('bills').on('child_added',billFetch2);
            rootRef.child(parentKey).child('bills').off('child_added',billFetch2)
        };

        rootRef.orderByChild('id').equalTo(this.props.tripId).on('child_added', fetchBill);
        rootRef.orderByChild('id').equalTo(this.props.tripId).off('child_added', fetchBill)

        let prevDebitor = this.state.debitor;
        for(var j = 0; j < prevDebitor.length; j++) {
            var obj = prevDebitor[j];

            if(obj.creditor === item.creditor && obj.debitor === item.debitor && obj.amount === item.amount) {
                prevDebitor.splice(j, 1);
                j--;
            }
        }
        this.setState({
            debitor : prevDebitor
        });

        alert("You paid Rs."+item.amount+" to "+item.creditor)
    }

    clearAmount(item){
        // console.log("inside clear ",item,this.state.tripID);
        // delete this bill from bill table

        var parentKey , childKey ;
        let rootRef = firebase.database().ref().child('bill');

        var updateStatus = function (snap) {
            if(snap.val().creditor === item.creditor && snap.val().debitor === item.debitor && snap.val().amount === item.amount && snap.val().status === 'pending') {
                console.log("Finally got ir", snap.val());
                let ref = rootRef.child(parentKey).child('bills').child(childKey).child('accounts')
                ref.child(snap.key).remove();
            }
        };

        var deleteBill3 = function (snap) {
            console.log("accounts are :", snap.val());
            for (let i = 0; i < snap.val().length; i++) {
                rootRef.child(parentKey).child('bills').child(childKey).child('accounts').on("child_added", updateStatus)
                rootRef.child(parentKey).child('bills').child(childKey).child('accounts').off("child_added", updateStatus)
            }
        };

        var deleteBill2 = function (snap) {
            console.log("each bill :",snap.val());
            childKey = snap.key;
            rootRef.child(parentKey).child('bills').child(childKey).on("child_added",deleteBill3)
            rootRef.child(parentKey).child('bills').child(childKey).off("child_added",deleteBill3)
        };

        var deleteBill = function (snap) {
            console.log("pay button clicked :",snap.val().bills);
            parentKey = snap.key;
            rootRef.child(parentKey).child('bills').on('child_added',deleteBill2);
            rootRef.child(parentKey).child('bills').off('child_added',deleteBill2)
        };

        rootRef.orderByChild('id').equalTo(this.props.tripId).on('child_added', deleteBill);
        rootRef.orderByChild('id').equalTo(this.props.tripId).off('child_added', deleteBill)

        let prevCreditor = this.state.creditor;
        for(var j = 0; j < prevCreditor.length; j++) {
            var obj = prevCreditor[j];

            if(obj.creditor === item.creditor && obj.debitor === item.debitor && obj.amount === item.amount) {
                prevCreditor.splice(j, 1);
                j--;
            }
        }
        this.setState({
            creditor : prevCreditor
        });

        alert("You cleared Rs."+item.amount+" of "+item.debitor)
    }

    render() {
        return (
            <div>
                {this.state.debitor.map((item) =>(
                <div className="my-transactions">
                    <p>Money to be paid to</p>
                    <p>{item.creditor}</p>
                    <p>Amount : <span>{item.amount}</span></p>
                    <center><button className=" clear-btn common-btn" onClick={this.payAmount.bind(this,item)}>Pay</button></center>
                </div>
                ))}

                {this.state.creditor.map((item) =>(
                    <div className="my-transactions">
                        <p>Money to be recieved from</p>
                        <p>{item.debitor}</p>
                        <p>Amount : <span>{item.amount}</span></p>
                        <center><button className=" clear-btn common-btn" onClick={this.clearAmount.bind(this,item)}>Clear</button></center>
                    </div>
                ))}
            </div>

        );
    }
}

export default GeneratedBill;
