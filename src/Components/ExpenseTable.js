import React, { Component } from 'react';
import '../App.css';
import TransactionTable from './TransactionTable'
import * as firebase from 'firebase'

class ExpenseTable extends Component {
    constructor(props){
        super(props);
        this.state={
           trans:'',
            trans2:''
        }
    }

    componentDidMount(){
        let tripName = this.props.tripName;
        console.log("inside table component :",tripName);
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(tripName).on('value', snap => {
            this.setState({
                trans:snap.val()
            },()=>{
                console.log("inside table :",this.state.trans)
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
        rootRef.on('child_added', snap => {
            console.log('****child added',snap.val());
        });
    }

    componentWillReceiveProps(){
        let tripName = this.props.tripName;
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
        rootRef.on('child_added', snap => {
            console.log('****child added',snap.val());
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

        return (
            <div className="expense">
                <table >
                    <tr>
                        <th>Expense By</th>
                        <th>Item</th>
                        <th>Amount</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>

                    {expenditures.map((item)=> {
                        if(item.trip === this.props.tripTo){
                            return(
                                <tr key={index++}>
                                    <TransactionTable item = {item}/>
                                </tr>
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
