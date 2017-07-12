import React, {Component} from 'react';
import '../App.css';
import ExpenseTable from './ExpenseTable'
import * as firebase from 'firebase'
import moment from 'moment'

class Expense extends Component {
    constructor() {
        super();
        this.state = {
            spend_by: '',
            title: '',
            amount: '',
            members: []
        }
    }

    componentWillMount() {
        let that = this;
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value',snap => {
            that.setState({
                members: snap.val().members
            })
        })
    }

    componentWillReceiveProps() {
        let that = this;
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value',snap => {
            that.setState({
                members: snap.val().members
            })
        })
    }

    changeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit(event) {
        event.preventDefault();
        let regex = /^[0-9]{1,10}$/;

        if (this.state.spend_by === '' || this.state.amount === '' || this.state.title === '') {
            alert("Fields cannot be empty!!!")
        } else if (regex.test(this.state.amount) === false) {
            alert("Amount should be a number only")
        } else {
            let rootRef = firebase.database().ref('trip/'+this.props.tripId);
            let transactioObject = {
                spend_by: this.state.spend_by,
                amount: this.state.amount,
                title: this.state.title,
                generatedBill: false,
                createdAt:moment().format()
            };

            rootRef.once('value',snap => {
                    if (snap.val().hasOwnProperty('transaction')) {
                        console.log("inside Expense Form",snap.val().transaction);
                        snap.ref.child('transaction').push({transactioObject});
                    }else{
                        console.log("doest not have transaction");
                        snap.ref.update({transaction: []});
                        snap.ref.child('transaction').push({transactioObject});
                    }
                }
            );
            this.setState({
                spend_by: '',
                amount: '',
                title: ''
            })
        }
    }
           /* rootRef.orderByChild("tripName").equalTo(trip).on('child_added', function (snap) {
                console.log("^^^^^^^^^^^^^^^^^", transactioObject)
                if (snap.val().hasOwnProperty('transaction')) {
                    if (snap.val().members.indexOf(user) !== -1) {
                        console.log("transaction is there*************", snap.val().members.indexOf(user));
                        snap.ref.child('transaction').push({transactioObject});
                    }
                } else {
                    if (snap.val().members.indexOf(user) !== -1) {
                        console.log("transaction is not there");
                        snap.ref.update({transaction: []});
                        snap.ref.child('transaction').push({transactioObject});
                    }
                }
            });
        }*/

    onChangeSpendBy(event) {
        this.setState({
            spend_by: event.target.value
        })
    }

    render() {
        console.log('this.props in expense--------',this.props);
        console.log('>>>>>>>>>', this.props.tripInfo);
        let opts;
        if(this.state.members && this.state.members.length){
            opts=this.state.members.map((item) => (
                    <option value={item}>{item}</option>
                )
            );
        } else{
            opts=[];
        }


        return (
            <div className="home">
                <div className="billGenerator">
                    <span className="trip-title">Welcome to Trip <label
                        className="trip-name">{this.props.tripInfo}</label></span>
                    <h4 className="modal-title register-tag">Spend By:</h4>
                    <div className="margin-from-top">
                        <label>Person's email:</label>
                        <select className="dropdown input-box" onChange={this.onChangeSpendBy.bind(this)}
                                value={this.state.spend_by}>
                            <option value="Select Trip">Select Person's email</option>
                            {opts}

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
                    <div><button className="submit-btn common-btn" onClick={this.onSubmit.bind(this)}>Submit</button></div>
                </div>
                <ExpenseTable tripName={this.props.tripInfo} user={this.props.user} tripId={this.props.tripId}/>

            </div>

        );
    }
}

export default Expense;
