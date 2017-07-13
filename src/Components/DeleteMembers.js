import React, { Component } from 'react';
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
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value',snap => {
            localMembers = snap.val().members;
            let index = localMembers.indexOf(item);
            if (index > -1) {
                localMembers.splice(index, 1);
            }
            this.setState({
                myMembers:localMembers
            },()=>{
                //now update db members count
                console.log("######### PPPP inside delete members :",this.state.myMembers)
                rootRef.update({members:this.state.myMembers});
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