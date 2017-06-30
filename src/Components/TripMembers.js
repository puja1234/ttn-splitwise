import React, { Component } from 'react';
import '../App.css';
import MemberDetails from './MemberDetails'
import * as firebase from 'firebase'

class TripMembers extends Component{
    constructor(){
        super();
        this.state={
            members:[]
        }
    }

    addMember(name){
        const { members } = this.state;
        members.push(name);
        this.setState({
            members,
        },()=>{
            // console.log(this.state.members, 'members------')
        })

    }

    addToDb(){
        //since firebase does not support array so storing members as object structure
        let rootRef = firebase.database().ref().child('trip');
        let billRef = firebase.database().ref().child('bill');

        var myRef = rootRef.push();
        var key = myRef.key;

        myRef.set({
            tripName: this.props.trip,
            members:this.state.members,
            createdAt :Date.now(),
            createdBy :this.props.user,
            transactions:[]
        });

        billRef.push().set({
            id:key,
            bills:[]
        });

        this.setState({
            members:[]
        });
        alert("Your Data has been saved :)");
    }

    render(){
        const inputBox = [];
        for(let i=0; i<this.props.memberCount;i++){
            inputBox.push(<MemberDetails addMember={this.addMember.bind(this)}/>)
        }

        return(
            <div>
                {inputBox}
                <button onClick={this.addToDb.bind(this)}>Save</button>
            </div>
        )
    }
}

export default TripMembers;