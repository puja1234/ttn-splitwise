import React, { Component } from 'react';
import '../App.css';
import MemberDetails from './MemberDetails'
import * as firebase from 'firebase'

class TripMembers extends Component{
    constructor(){
        super();
        this.state={
            members:[],
            myMemberList:''
        }
    }

    addMember(name){
        const { members } = this.state;

        console.log(members,name,members.indexOf(name));
        if(members.indexOf(name) == -1 ){
            members.push(name);
            this.setState({
                members,
            },()=>{
                console.log(this.state.members, 'members------')
            })
        }else{
            alert("same email members are not allowed!!")
        }

    }

    addToDb(){
        //since firebase does not support array so storing members as object structure
        let rootRef = firebase.database().ref().child('trip');
        let billRef = firebase.database().ref().child('bill');
        let localMembers;
        let that = this;

        if(this.props.trip === '' || this.props.memberCount === ''){
            alert('trip cannot be empty');

        }
        else{
            if(this.props.hasoriginalMembers){
                console.log("+++++++++++++you have to append new members to original members+++++++++++++ ");
                rootRef.orderByChild('tripName').equalTo(this.props.trip).once('value',snap => {
                    console.log("originalMembers count ",snap.val());
                    for(let key in snap.val()){
                        if (snap.val()[key].members.indexOf(this.props.user) !== -1) {
                            localMembers = snap.val()[key].members
                        }
                    }
                    that.setState({
                        members : localMembers.concat(this.state.members)
                    },()=>{
                        //now update db members count
                        rootRef.orderByChild('tripName').equalTo(this.props.trip).once('child_added',snap => {
                            let ref = rootRef.child(snap.key);
                            ref.update({members:this.state.members});
                        }, this.props.editMembersDone())
                    })
                });


            }else {
                var myRef = rootRef.push();
                var key = myRef.key;

                myRef.set({
                    tripName: this.props.trip,
                    members: this.state.members,
                    createdAt: Date.now(),
                    createdBy: this.props.user,
                    transactions: []
                });

                billRef.push().set({
                    id: key,
                    bills: []
                });
                this.props.clearState();
                this.setState({
                    members: []
                });
                alert("Your Data has been saved :)");
            }
        }

    }

    render(){
        const inputBox = [];
        for(let i=0; i<this.props.memberCount;i++){
            inputBox.push(<MemberDetails addMember={this.addMember.bind(this)}/>)
        }

        return(
            <div>
                {inputBox}
                <button className="common-btn" onClick={this.addToDb.bind(this)}>Save</button>
            </div>
        )
    }
}

export default TripMembers;