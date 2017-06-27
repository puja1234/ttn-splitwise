import React, { Component } from 'react';
import '../App.css';
import * as firebase from 'firebase'

class Bill extends Component {
    constructor(props){
        super(props);
        this.state ={
            displayButton:false
        }
    }
    componentWillMount(){
        let tripName = this.props.tripName;
        console.log("inside table component :",tripName);
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(tripName).on('value', snap => {
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
                                          })
                                      }
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
        let tripId;
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild("tripName").equalTo(trip).on('child_added', function (snap1) {
            if (snap1.val().hasOwnProperty('transaction')) {
                if (snap1.val().members.indexOf(user) !== -1) {
                  rootRef.child(snap1.key).child('transaction').on('value',function (snap) {
                        snap.forEach(function (childSnapshot) {
                            console.log("root key ",snap1.key," child key ",childSnapshot.key );
                           /* var db = firebase.database();
                           let transRef= db.ref('trip'+snap1.key+'/transaction'+childSnapshot.key+'transactioObject');
                           transRef.child('generatedBill').setValue('true');
*/
                           let taskId = childSnapshot.key;

                            let m_objFireBaseRef = firebase.database().ref().child('trip');
                            let objRef = m_objFireBaseRef.child(snap1.key);
                            let taskRef = objRef.child('transaction');
                            let statusRef = taskRef.child(childSnapshot.key);
                            let trRef = statusRef.child('transactioObject');
                            let trRef1=trRef.child('generatedBill');
                            trRef.update({generatedBill:true});
                        })
                  });
                }
            }
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

            </div>
        );
    }
}

export default Bill;
