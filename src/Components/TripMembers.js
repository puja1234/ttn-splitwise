import React, { Component } from 'react';
import MemberDetails from './MemberDetails'
import * as firebase from 'firebase'
import moment from 'moment'

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
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        let newTripRef = firebase.database().ref().child('trip');
        let billRef = firebase.database().ref().child('bill');
        let localMembers;
        let that = this;

        if(this.props.trip === '' || this.props.memberCount === '' || this.state.members.length === 0 ){
            alert('trip cannot be empty');
        }
        else{
            console.log("!!!!!!!trip members",this.state.members.length,this.state.members,this.props.memberCount)
            if(this.props.hasoriginalMembers){
                rootRef.on('value',snap => {
                    console.log("inside tripMembers component",snap.val());
                    localMembers = snap.val().members;
                    that.setState({
                        members : localMembers.concat(this.state.members)
                    },()=>{
                        rootRef.update({members:this.state.members});
                        this.props.editMembersDone();
                    })
                })

            }else {
                let myRef = newTripRef.push();
                let key = myRef.key;

                myRef.set({
                    tripName: this.props.trip,
                    members: this.state.members,
                    createdAt: moment().format(),
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
            inputBox.push(<MemberDetails addMember={this.addMember.bind(this)} members={this.state.members}/>)
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