import React, {Component} from 'react';
import '../App.css';
import ExpenseTable from './ExpenseTable'
import * as firebase from 'firebase'

class Expense extends Component {
    constructor() {
        super();
        this.state = {
            spend_by: '',
            title: '',
            amount: '',

        }
    }

    changeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit(event) {
        event.preventDefault();
        let user=this.props.user;
        let trip = this.props.tripInfo;
        console.log("trip on button click is :", trip);
        let regex = /^[0-9]{1,10}$/;
        if (this.state.spend_by === '' || this.state.amount === '' || this.state.title === '') {
            alert("Fields cannot be empty!!!")
        } else if (regex.test(this.state.amount) === false) {
            alert("Amount should be a number only")
        } else {
            let rootRef = firebase.database().ref().child('trip');
            let transactioObject = {
                spend_by: this.state.spend_by,
                amount: this.state.amount,
                title: this.state.title,
                generatedBill : false
            };
            rootRef.orderByChild("tripName").equalTo(trip).on('child_added', function (snap) {
                console.log("^^^^^^^^^^^^^^^^^",transactioObject)
                if (snap.val().hasOwnProperty('transaction')) {
                    if(snap.val().members.indexOf(user)!==-1) {
                        console.log("transaction is there*************", snap.val().members.indexOf(user));
                        snap.ref.child('transaction').push({transactioObject});
                    }
                } else {
                    if(snap.val().members.indexOf(user)!==-1) {
                        console.log("transaction is not there");
                        snap.ref.update({transaction: []});
                        snap.ref.child('transaction').push({transactioObject});
                    }
                }
            });
        }

        this.setState({
            spend_by: '',
            amount: '',
            title: ''
        })
    }

    onChangeSpendBy(event) {
        this.setState({
            spend_by: event.target.value
        })
    }

    render() {
        console.log('>>>>>>>>>', this.props.tripInfo);
        return (
            <div className="home">
                <div className="billGenerator">
                    <span className="trip-title">Welcome to Trip {this.props.tripInfo}</span>
                    <h4 className="modal-title register-tag">Bill Generator</h4>
                        <div className="margin-from-top">
                            <label>Person's email:</label>
                            <select className="dropdown input-box" onChange={this.onChangeSpendBy.bind(this)}
                                    value={this.state.spend_by}>
                                <option value="Select Trip">Select Person's email</option>
                                {this.props.members.map((item) => (
                                    <option value={item}>{item}</option>
                                ))
                                }
                                )}
                            </select>
                        </div>

                        <div className="margin-from-top">
                            <label>Spend on:</label>
                            <input type="text"
                                                            className="input-box"
                                                            value={this.state.title}
                                                            name="title"
                                                            placeholder="Title"
                                                            onChange={this.changeHandler.bind(this)}
                            />
                        </div>

                        <div className="margin-from-top">
                            <label>Amount :</label>
                            <input type="text"
                                                           className="input-box"
                                                           value={this.state.amount}
                                                           name="amount"
                                                           placeholder="Amount"
                                                           onChange={this.changeHandler.bind(this)}
                            />
                        </div>
                    <center><button onClick={this.onSubmit.bind(this)}>Submit</button></center>
                </div>
                <ExpenseTable tripName={this.props.tripInfo} user={this.props.user} />

            </div>

        );
    }
}

export default Expense;
