import React, { Component } from 'react';
import '../App.css';
import Bill from './Bill'
import ExpenseTable from './ExpenseTable'
import * as firebase from 'firebase'

class Expense extends Component {
    constructor(){
        super();
        this.state={
            spend_by:'',
            title:'',
            amount:'',

        }
    }

    changeHandler(event){
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    onSubmit(event) {
        event.preventDefault();
        let trip = this.props.tripInfo;
        console.log("trip on button click is :",trip);
        let regex = /^[0-9]{1,10}$/;
        if (this.state.spend_by == '' || this.state.amount == '' || this.state.title == '') {
            alert("Fields cannot be empty!!!")
        } else if (regex.test(this.state.amount) == false) {
            alert("Amount should be a number only")
        }else{
           let rootRef = firebase.database().ref().child('trip');
           let transactioObject = {
               spend_by:this.state.spend_by,
               amount:this.state.amount,
               title:this.state.title
           };
           rootRef.orderByChild("tripName").equalTo(trip).on('child_added',function (snap) {
               if(snap.val().hasOwnProperty('transaction')){
                  console.log("transaction is there");
                snap.ref.child('transaction').push({transactioObject});
               }else{
                  console.log("transaction is not there");
                  snap.ref.update({transaction:[]});
                  snap.ref.child('transaction').push({transactioObject});
               }
           })
        }

        this.setState({
            spend_by:'',
            amount:'',
            title:''
        })
    }

    onChangeSpendBy(event){
        this.setState({
            spend_by:event.target.value
        })
    }

    render() {
        console.log('>>>>>>>>>', this.props.tripInfo);
        return (
                <div className="home">

                        <div className="writeExpense">
                            <div className="bottom text-center">
                                <a href="#" data-toggle="modal" data-target="#modalBillAdd"><b>Add Bill</b></a>
                            </div>

                            <div id="modalBillAdd" className="modal fade register-modal" role="dialog">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h4 className="modal-title register-tag">Bill Generator</h4>
                                        </div>
                                        <div className="modal-body">
                                            Person's email:
                                            <select className="dropdown" onChange={this.onChangeSpendBy.bind(this)} value={this.state.spend_by}><option value="Select Trip">Select Person's email</option>
                                                {this.props.members.map((item)=>(
                                                    <option value={item}>{item}</option>
                                                ))
                                                }
                                                )}
                                            </select>

                                            Spend on:<input type="text"
                                                            value={this.state.title}
                                                            name="title"
                                                            placeholder="Title"
                                                            onChange={this.changeHandler.bind(this)}
                                        />
                                            Amount :<input type="text"
                                                           value={this.state.amount}
                                                           name="amount"
                                                           placeholder="Amount"
                                                           onChange={this.changeHandler.bind(this)}
                                        />
                                            <button onClick={this.onSubmit.bind(this)}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <ExpenseTable tripName={this.props.tripInfo} />

                </div>
        );
    }
}

export default Expense;
