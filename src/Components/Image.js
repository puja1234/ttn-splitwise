import React, { Component } from 'react';

class Image extends Component {
    constructor(props){
        super(props);

        this.state = {
            checked:false,
            ImageUrl:''
        }
    }

    onCheckboxClick = () => {

        if(this.state.checked === false){
            this.setState({
                checked:true,
                ImageUrl:this.props.source
            },()=> {
                this.props.imageSelector(this.state.ImageUrl);
            })
        }
        else if(this.state.checked === true ){
            this.setState({
                checked:false,
                ImageUrl:this.props.source
            },()=>{
                this.props.imageSelector(this.state.ImageUrl);
            })
        }

    };

    render(){
        //console.log('this.props in image component---------------',this.props);
        return(
            <div className="image-wrapper">
                <div>
                    <div>
                        <input type="checkbox" className="image-checkbox"
                               value={this.state.checked} onClick={this.onCheckboxClick.bind(this)} />
                    </div>
                    <div>
                        <img className="image-urls" alt="trip image" src={this.props.source}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Image;