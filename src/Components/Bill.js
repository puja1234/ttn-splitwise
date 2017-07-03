import React, { Component } from 'react';
import '../App.css';
import * as firebase from 'firebase'
import GeneratedBill from './GeneratedBill'

class Bill extends Component {
    constructor(props){
        super(props);
        this.state ={
            displayButton:false,
            trans:'',
            trans2:'',
            displayBill:false
        }
    }

    componentDidMount(){
        let tripName = this.props.tripName;

        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(tripName).once('value', snap => {
            this.setState({
                trans:snap.val()
            },()=>{
                for(let key in this.state.trans){
                    if(this.state.trans.hasOwnProperty(key)) {
                        if (this.state.trans[key].members.indexOf(this.props.user) !== -1) {
                            this.setState({
                                trans2: this.state.trans[key].transaction
                            }, () => {
                                console.log("inside bill component ************:", this.state.trans2);
                                for (let key in this.state.trans2) {
                                    if (this.state.trans2.hasOwnProperty(key) ) {
                                      if(this.state.trans2[key].transactioObject.generatedBill===false){
                                          this.setState({
                                              displayButton:true
                                          });
                                          break;
                                      }/*else{
                                          this.setState({
                                              displayButton:false
                                          })
                                      }*/
                                    }
                                }
                            })
                        }
                    }
                }
            });
        });
    }

    componentWillReceiveProps(){
        let tripName = this.props.tripName;
        console.log("inside table component :",tripName);
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(tripName).once('value', snap => {
            this.setState({
                trans:snap.val()
            },()=>{
                for(let key in this.state.trans){
                    if(this.state.trans.hasOwnProperty(key)) {
                        if (this.state.trans[key].members.indexOf(this.props.user) !== -1) {
                            this.setState({
                                trans2: this.state.trans[key].transaction
                            }, () => {
                                console.log("inside bill component ************:", this.state.trans2);
                                for (let key in this.state.trans2) {
                                    if (this.state.trans2.hasOwnProperty(key) ) {
                                        if(this.state.trans2[key].transactioObject.generatedBill===false){
                                            this.setState({
                                                displayButton:true
                                            });
                                            break;
                                        }/*else{
                                            this.setState({
                                                displayButton:false
                                            })
                                        }*/
                                    }
                                }
                            })
                        }
                    }
                }
            });
        });
    }

    generateBill(){
        let trip=this.props.tripName;
        let user = this.props.user;
        let transactions =[];
         let totalAmount = 0;
        /*console.log("previous amount",totalAmount)*/
        let rootRef = firebase.database().ref().child('trip');

        this.setState({
            displayButton:false
        });

        var updateGeneratedBill = function (snap) {
            console.log("hiee",snap.val(),"__________",snap.key);
            var checkBillStatus = function (transSnap) {  // run number of transaction times
                console.log("transaction child is :",transSnap.val().transactioObject,"________",transSnap.key) ;
                if(transSnap.val().transactioObject.generatedBill === false){
                    console.log("amount is :",transSnap.val().transactioObject.amount);

                    totalAmount += parseInt(transSnap.val().transactioObject.amount);
                    rootRef.child(snap.key).child('transaction').child(transSnap.key).child('transactioObject').child('generatedBill').on('value',function (trans) { //run once for each transaction
                            console.log("inside transaction id is:",transSnap.key, " value is :",trans.val());

                            if(trans.val() === false){
                                transactions.push(transSnap.val().transactioObject);
                                console.log("pushed value is:",transSnap.val().transactioObject)
                            }

                            let ref = rootRef.child(snap.key).child('transaction').child(transSnap.key).child('transactioObject');
                            ref.update({generatedBill:true})
                    })
                }
            };

            if(snap.val().members.indexOf(user) !== -1){ // run single time
                console.log("my trip is",snap.val(),"__________",snap.key);
                rootRef.child(snap.key).child('transaction').on('child_added', checkBillStatus);
                rootRef.child(snap.key).child('transaction').off('child_added', checkBillStatus);
            }
        };


      //update generatedBill to true and add amount
        rootRef.orderByChild('tripName').equalTo(trip).on('child_added', updateGeneratedBill);


        rootRef.orderByChild('tripName').equalTo(trip).off('child_added', updateGeneratedBill);


        //update bill table add bills to it

        console.log("members are :",this.props.members.length);
        console.log(" total amount is :",totalAmount);
        let share = totalAmount/this.props.members.length;
        console.log("share is :",share);
        console.log("transactions are in array :",transactions,this.props.members);
        let debitor =[];
        let creditor =[];

        // check if member is not in transaction array then push him in debitors array
       /* for(let key in transactions){
            for(let i=0 ; i< this.props.members.length ; i++){
                if(this.props.members[i] === transactions[key].spend_by)

            }
        }*/
       let found = true;
      let  members = this.props.members;
      var k = 0;
       for(k=0;k<members.length;k++){
           if(found === false){
               console.log(members[k-1], "  has not spend any thing%%%%%%%%%%%");
               debitor.push({name:members[k-1],amount:share})
           }
               found = false;
           for(let key in transactions){
               if(members[k] === transactions[key].spend_by){
                   console.log(members[k],'has spend%%%%%%%%5')
                   found = true;
                   break;
               }else{
                   console.log("match not found%%%")
                   found = false
               }
           }
       }

        if(found === false){
            console.log(members[k-1], "  has not spend any thing%%%%%%%%%%%");
            debitor.push({name:members[k-1],amount:share})
        }


        for(let key in transactions){
            if(transactions[key].amount - share < 0){
                console.log(transactions[key].spend_by , "is the debitor");
                debitor.push({name:transactions[key].spend_by,amount:-(transactions[key].amount-share)})
            }else{
                console.log(transactions[key].spend_by , "is the creditor");
                creditor.push({name:transactions[key].spend_by,amount:transactions[key].amount-share})
            }
        }

        console.log("Creditors :",creditor);
        console.log("Debitors :",debitor);
let status = 'pending';
        let accounts = [], i = 0, j = 0;
        while( i < creditor.length && j < debitor.length){
            if(creditor[i].amount < debitor[j].amount){
                debitor[j].amount = debitor[j].amount - creditor[i].amount;
                console.log(debitor[j].name," will give ",creditor[i].name," ",creditor[i].amount);
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
                console.log(debitor[j].name," will give ",creditor[i].name," ",debitor[j].amount);
                debitor[j]=0;
                j++;
            }
        }
        console.log("$$$$$$$$$$$",accounts);
        rootRef.orderByChild('tripName').equalTo(trip).on('child_added',function (snap) {
            if(snap.val().members.indexOf(user) !== -1){
                let key = snap.key;
                let billRef = firebase.database().ref().child('bill');
                billRef.orderByChild("id").equalTo(key).on('child_added', function (billSnap) {
                    console.log("#######3",billSnap.val());
                    if (billSnap.val().hasOwnProperty('bills')) {
                        console.log("bill is there %%%%%%%%%%%%%%55",accounts);
                           let billPush = billSnap.ref.child('bills').push();
                           billPush.set({accounts})

                    } else {
                        console.log("bill is not there%%%%%%%%%%%%%%%%");
                            billSnap.ref.update({bills: []});
                            billSnap.ref.child('bills').push({accounts});
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
                    <button onClick={this.generateBill.bind(this)}>Generate Bill</button>:
                    ''
                }

                    <GeneratedBill user={this.props.user} tripName={this.props.tripName}/>


            </div>
        );
    }
}

export default Bill;
