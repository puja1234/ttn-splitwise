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
        let rootRef = firebase.database().ref().child('trip');
        console.log("originalMembers ",this.props.trip);
        rootRef.orderByChild('tripName').equalTo(this.props.trip).on('value',snap => {
            console.log("originalMembers ",snap.val());
            for(let key in snap.val()){
                if (snap.val()[key].members.indexOf(this.props.user) !== -1) {
                   localMembers = snap.val()[key].members
                }
            }
          that.setState({
              myMemberList: localMembers
          })
        })
    }

    componentWillReceiveProps(){
        let localMembers ;
        let that = this;
        let rootRef = firebase.database().ref().child('trip');
        console.log("originalMembers ",this.props.trip);
        rootRef.orderByChild('tripName').equalTo(this.props.trip).on('value',snap => {
            console.log("originalMembers ",snap.val());
            for(let key in snap.val()){
                if (snap.val()[key].members.indexOf(this.props.user) !== -1) {
                    localMembers = snap.val()[key].members
                }
            }
            that.setState({
                myMemberList: localMembers
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
                                    <DeleteMembers userEmail={item} user={this.props.user} trip={this.props.trip} deleteMembersDone={this.props.deleteMembersDone}/>
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