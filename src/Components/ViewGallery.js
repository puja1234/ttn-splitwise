import React, { Component } from 'react';
import Storage from './Storage'
import photoGallery from '../Images/photoGallery2.jpg'

class ViewGallery extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let template;
        if(this.props.trip == '' && this.props.myImages == ''){
            template = (<div className="no-trip-selected"><img src={photoGallery} alt="Gallery Img"/></div>)
        }
        else{
            if(this.props.tripId){
                template = (<div className='storage-div'>
                    <h3>Welcome to trip {this.props.trip}</h3>
                    <Storage trip={this.props.trip}
                             tripId = {this.props.tripId}
                             user={this.props.user}
                             myImages={this.props.myImages}/>
                </div>)
            }else{
                template = (<div className="no-trip-selected"><img src={photoGallery} alt="Gallery Img"/></div>)
            }

        }
        return(
            <div>
                {template}
            </div>
        );
    }
}

export default ViewGallery;