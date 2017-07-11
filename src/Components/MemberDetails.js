/**
 * Created by puja on 23/6/17.
 */
import React, { Component } from 'react';
import '../App.css';

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
        if(this.state.memberDetail.length===0){
            alert("Member name cannot be empty!!!")
        }else if(this.props.members.indexOf(this.state.memberDetail) >=0 ) {
            alert("Member already exist");
            this.setState({
                memberDetail:''
            })
        }
        else
        {
            this.props.addMember(this.state.memberDetail);
            this.setState({
                view: false
            })
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
                ''}
            </div>
        )
    }
}

export default MemberDetails;