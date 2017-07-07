import React, { Component } from 'react';
import '../App.css';

export default class Edit extends Component {
    constructor(props) {
        super(props);
        const {amount, spend_by , title} = props.transInfo;
        this.state = {
            amount,
            generatedBill : false,
            spend_by,
            title
        }
    }

    componentWillReceiveProps(props){
        const {amount, spend_by , title} = props.transInfo;
        this.setState ({
            amount,
            spend_by,
            title
        })
    }

    saveChanges = (event) => {
        event.preventDefault();
        console.log("saved chnages :",this.state);
        this.props.updateTransaction(this.props.transInfo,this.state)
    };


    render() {
        return (
            <div >
                <div >
                    <form className="">
                        <input type="text" className="form-control" value={this.state.spend_by} onChange={(e) => this.setState({spend_by: e.target.value})}/>&nbsp;
                        <input type="text" className="form-control" value={this.state.title} onChange={(e) => this.setState({title: e.target.value})}/>&nbsp;
                        <input type="text" className="form-control" value={this.state.amount} onChange={(e) => this.setState({amount: e.target.value})}/>&nbsp;
                        <button className="" onClick={this.saveChanges}>Save</button>&nbsp;
                    </form>
                </div>
            </div>
        )
    }
}