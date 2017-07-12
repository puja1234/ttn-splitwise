import React, { Component } from 'react';
import '../App.css';
import * as firebase from 'firebase'
import DeleteMembers from './DeleteMembers'

class OriginalMembers extends Component {
    constructor(){
        super();
        this.state={
            myMemberList : ''
        }
    }

    componentWillMount(){
        let localMembers ;
        let that = this;
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value',snap =>{
            localMembers = snap.val().members;
            that.setState({
                myMemberList: localMembers
            },()=>{
                console.log("inside originalMemberComponent",this.state.myMemberList)
            })
        })
    }

    componentWillReceiveProps(){
        let localMembers ;
        let that = this;
        let rootRef = firebase.database().ref('trip/'+this.props.tripId);
        rootRef.once('value',snap =>{
            localMembers = snap.val().members;
            that.setState({
                myMemberList: localMembers
            },()=>{
                console.log("inside originalMemberComponent",this.state.myMemberList)
            })
        })
    }

    render() {

        return (
            <div>
                {
                    this.props.deleteMembers ?
                        <div>
                            {
                                this.state.myMemberList.map((item) =>(
                                    <DeleteMembers userEmail={item} user={this.props.user} trip={this.props.trip} tripId={this.props.tripId} deleteMembersDone={this.props.deleteMembersDone}/>
                                    ))
                            }
                        </div> :

                    this.state.myMemberList.map((item) =>(
                        <input type="text" value={item}/>
                        )
                    )
                }
            </div>
        );
    }
}

export default OriginalMembers;