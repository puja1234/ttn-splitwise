import React, { Component } from 'react';
import * as firebase from 'firebase'

class MemberDetails extends Component{
    constructor(){
        super();
        this.state={
            memberDetail:'',
            view:true
        }
    }

    changeHandler(event){
        this.setState({
            memberDetail: event.target.value
        })
    }

    doneHandler(){
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(this.state.memberDetail.length===0){
            alert("Member name cannot be empty!!!")
        }
        else if(re.test(this.state.memberDetail)=== false){
            alert("Enter valid email-id!!!")
        }else if(this.props.hasoriginalMembers){
            let localMembers;
            let rootRef = firebase.database().ref('trip/'+this.props.tripId);
            rootRef.once('value',snap => {
                localMembers = snap.val().members;
                if(localMembers.indexOf(this.state.memberDetail) >=0){
                    alert("Member already exist ");
                    this.setState({
                        memberDetail:''
                    })
                }else {
                    console.log("adding new member");
                    this.props.addMember(this.state.memberDetail);
                    this.setState({
                        view: false
                    });
                    this.props.addmoreTrue();
                }
            });
        }
        else if(this.props.members.indexOf(this.state.memberDetail) >=0 ) {
            alert("Member already exist ");
            this.setState({
                memberDetail:''
            })
        }else {
            console.log("adding new member");
            this.props.addMember(this.state.memberDetail);
            this.setState({
                view: false
            });
            this.props.addmoreTrue();
        }
    }

    render(){
        return(
            <div>
                <input type="text" onChange={this.changeHandler.bind(this)} placeholder="Enter members" value={this.state.memberDetail}/>
                {this.state.view
                    ?
                    <button className="common-btn" onClick={this.doneHandler.bind(this)}>Done </button>
                    :
                    ''
                }
            </div>
        )
    }
}

export default MemberDetails;