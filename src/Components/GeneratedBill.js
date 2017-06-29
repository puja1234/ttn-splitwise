import React, { Component } from 'react';
import '../App.css';
import * as firebase from 'firebase'

class GeneratedBill extends Component {
    constructor(){
        super();
        this.state = {
            tripID:'',
            trans:'',
            debitor:[],
            creditor:[]
        }
    }
    componentWillMount(){
        let tripName = this.props.tripName;
        let usersDebit =[] , userdCredit =[]
        console.log("``````trip name is :",tripName);
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(tripName).on('child_added', snap => {
            console.log("~~~~~~~~",snap)
            if(snap.val().members.indexOf(this.props.user) !== -1){
                console.log("my trip is~~~~~~~~~",snap.val(),"__________",snap.key);
                this.setState({
                    tripID:snap.key
                },()=>{
                    console.log("~trip id is :",this.state.tripID)
                })
                // search bill table with this trip id

                let billRef  = firebase.database().ref().child('bill');
                billRef.orderByChild('id').equalTo(this.state.tripID).on('child_added',billSnap =>{
                    console.log("~~~~~~~bills are" , billSnap.val())
                    for(let key in billSnap.val().bills){
                        for( let i =0; i< billSnap.val().bills[key].accounts.length;i++){
                            if(billSnap.val().bills[key].accounts[i].debitor === this.props.user && billSnap.val().bills[key].accounts[i].status === 'pending'){
                                usersDebit.push(billSnap.val().bills[key].accounts[i]);
                                console.log("~~~~~accounts",billSnap.val().bills[key].accounts[i]);
                            }else if(billSnap.val().bills[key].accounts[i].creditor === this.props.user && billSnap.val().bills[key].accounts[i].status === 'pending'){
                                userdCredit.push(billSnap.val().bills[key].accounts[i]);
                                console.log("~~~~~accounts",billSnap.val().bills[key].accounts[i]);
                            }
                        }

                    }
                    this.setState({
                        debitor:usersDebit,
                        creditor:userdCredit
                    },()=>{
                        console.log("**********",this.state.debitor,this.state.creditor)
                    })
                })
            }
        });

    }

    componentWillReceiveProps(){
        let tripName = this.props.tripName;
        let usersDebit =[] , userdCredit =[];
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(tripName).on('child_added', snap => {
            console.log("~~~~~~~~",snap)
            if(snap.val().members.indexOf(this.props.user) !== -1){ // run single time
                console.log("my trip is~~~~~~~~~~~~~",snap.val(),"__________",snap.key);
                this.setState({
                    tripID:snap.key
                },()=>{
                    console.log("~trip id is :",this.state.tripID)
                });

                // search bill table with this trip id

                let billRef  = firebase.database().ref().child('bill');
                billRef.orderByChild('id').equalTo(this.state.tripID).on('child_added',billSnap =>{
                    console.log("~~~~~~~bills are" , billSnap.val());
                    for(let key in billSnap.val().bills){
                        for( let i =0; i< billSnap.val().bills[key].accounts.length;i++){
                            if(billSnap.val().bills[key].accounts[i].debitor === this.props.user && billSnap.val().bills[key].accounts[i].status === 'pending'){
                                usersDebit.push(billSnap.val().bills[key].accounts[i]);
                                console.log("~~~~~accounts",billSnap.val().bills[key].accounts[i])
                            }else if(billSnap.val().bills[key].accounts[i].creditor === this.props.user && billSnap.val().bills[key].accounts[i].status === 'pending'){
                                userdCredit.push(billSnap.val().bills[key].accounts[i]);
                                console.log("~~~~~accounts",billSnap.val().bills[key].accounts[i])
                            }
                        }
                    }
                    this.setState({
                        debitor:usersDebit,
                        creditor:userdCredit
                    },()=>{
                        console.log("**********",this.state.debitor,this.state.creditor)
                    })
                })
            }
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

        rootRef.orderByChild('id').equalTo(this.state.tripID).on('child_added', fetchBill);
        rootRef.orderByChild('id').equalTo(this.state.tripID).off('child_added', fetchBill)

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
        })
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

        rootRef.orderByChild('id').equalTo(this.state.tripID).on('child_added', deleteBill);
        rootRef.orderByChild('id').equalTo(this.state.tripID).off('child_added', deleteBill)

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
        })
    }

    render() {
        return (
            <div>
                {this.state.debitor.map((item) =>(
                    <div>
                        <p>{item.creditor+"  "+item.amount}</p>
                        <button onClick={this.payAmount.bind(this,item)}>Pay</button>
                    </div>
                ))}

                {this.state.creditor.map((item) =>(
                    <div>
                        <p>{item.debitor+" "+item.amount}</p>
                        <button onClick={this.clearAmount.bind(this,item)}>Clear</button>
                    </div>
                ))}
            </div>

        );
    }
}

export default GeneratedBill;