import React, { Component } from 'react';
import '../App.css';
import * as firebase from 'firebase'

class DeleteMembers extends Component {
    constructor(){
        super();
        this.state={
            myMembers:''
        }
    }
    deleteMember(item){
        let localMembers;
        let that = this;
        let rootRef = firebase.database().ref().child('trip');
        rootRef.orderByChild('tripName').equalTo(this.props.trip).once('value',snap => {
            for(let key in snap.val()){
                if (snap.val()[key].members.indexOf(this.props.user) !== -1) {
                    localMembers = snap.val()[key].members;
                    let index = localMembers.indexOf(item);
                    if (index > -1) {
                        localMembers.splice(index, 1);
                    }
                    console.log("######3",localMembers)
                }
            }

            this.setState({
                myMembers:localMembers
            },()=>{
                //now update db members count
                console.log("######### PPPP inside delete members :",this.state.myMembers)
                rootRef.orderByChild('tripName').equalTo(this.props.trip).once('child_added',snap => {

                    let ref = rootRef.child(snap.key);
                    ref.update({members:this.state.myMembers});
                })
            })
        })
    }

    render() {
        return(
            <div>
                <input type="text" value={this.props.userEmail}/>
                <button onClick={this.deleteMember.bind(this,this.props.userEmail)}>Delete</button>
            </div>
        )
    }

}

export default DeleteMembers