/**
 * Created by saubhagya on 3/7/17.
 */
/**
 * Created by saubhagya on 3/7/17.
 */
import React, { Component } from 'react';
import '../App.css';
import TripMembers from './TripMembers'
import * as firebase from 'firebase'
import Image from './Image'

class Storage extends Component{
    constructor(){
        super();

        this.state = {
            imageUploader:'',
            imageFile:'',
            selectedImageUrl:'',
            localArray:[],
            imageUrl:[],
            /*myImages:[],*/
            linkDisplay:false
        }
    }

    onImageUploaderChange = (event) => {

        if(this.props.trip == ''){
            alert('please select a trip...');
        }
        else{
            let imgPostedBy=this.props.user;
            let currentTrip = this.props.trip;

            var file = event.target.files[0];

            //to upload image for a particular trip...
            //if we want store all images together, just remove this,state.trip from the statement below.

            var storageRef = firebase.storage().ref('AppGallery/'+this.props.user+
                '/'+this.props.trip+
                '/'+file.name);
            var task = storageRef.put(file);
            console.log("task that stores storage ref-----",task);
            task.on('state_changed',(snapshot) => {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.setState({
                        imageFile: file,
                        imageUploader: percentage
                    });
                },function(error){
                    console.log('error occuring during state changed',error);
                },
                function() {
                    var downloadURL = task.snapshot.downloadURL;
                    console.log('downloadURL+++++', downloadURL);

                    let imageURL = downloadURL
                    console.log('task.fullpath=======',downloadURL);
                    let rootRef = firebase.database().ref().child('trip');
                    rootRef.orderByChild("tripName").equalTo(currentTrip).on('child_added', function (snapshot) {
                        if (snapshot.val().hasOwnProperty('imageFiles')) {
                            if (snapshot.val().members.indexOf(imgPostedBy) !== -1) {
                                console.log("imageURL is there*************", snapshot.val().members.indexOf(imgPostedBy));
                                snapshot.ref.child('imageFiles').push({imageURL});
                            }
                        } else {
                            if (snapshot.val().members.indexOf(imgPostedBy) !== -1) {
                                console.log("imageURL is not there");
                                snapshot.ref.update({imageFiles: []});
                                snapshot.ref.child('imageFiles').push({imageURL});
                            }
                        }
                    });
                }
            );
        }

    }

    onSelectImage = (url) => {
        let imageUrlArray = [];
        let flag = 0;
        imageUrlArray = this.state.localArray;
        for(let i=0;i<imageUrlArray.length;i++){
            if(imageUrlArray[i] === url){
                imageUrlArray.splice(i,1);
                flag = 1;
            }
        }
        if(flag == 0){
            this.setState({
                selectedImageUrl:url
            }, function(){
                console.log('value-------------',this.state.selectedImageUrl);
                imageUrlArray.push(this.state.selectedImageUrl);
                this.setState({
                    localArray: imageUrlArray
                },function(){
                    console.log('localArray',this.state.localArray);
                })
            });
        }
        else{
            flag = 0;
        }

    }

    onImgDownload = () => {

        if(this.props.trip == ''){
            alert('Please select a trip to download images..');
        }
        else{
            /*let imageUrlArray = [];
             imageUrlArray = this.state.localArray;*/
            alert('image selection for download complete...!');
            /*for(let i=0; i<imageUrlArray.length; i++) {*/
            this.setState({
                imageUrl: this.state.localArray,
                linkDisplay:true
            })
            //}
            //when you have multiple images and we were recieving image names instead of urls in array below.....
            /*let imageUrlArray = this.state.localArray;
             for(let i=0; i<imageUrlArray.length; i++) {
             this.fetchImage((imageUrl) => {
             this.setState({
             imageUrl
             })

             },imageUrlArray[i])
             }*/

            //when we were downloading single image, we got the value from----->
            /* this.fetchImage((imageUrl) => {
             this.setState({
             imageUrl
             })

             })*/

        }


    };

    render(){
        let imagesArray = this.state.imageUrl;
        return(
            <div>
                <div className="image-upload-div">
                    Upload an image: <input type="file"
                                            name=""
                                            accept="image/*"
                                            id="fileButton"
                                            onChange={this.onImageUploaderChange.bind(this)}/>

                    <progress value={this.state.imageUploader}
                              max="100"
                              id="uploader">{this.state.imageUploader}%</progress><br/>

                </div>

                <div>
                    Download images:-
                    <ul className="image-render">
                        {this.props.myImages.map((item)=>(
                            <li><Image source={item} imageSelector={this.onSelectImage.bind(this)}/></li>
                        ))}
                    </ul>

                    <button onClick={this.onImgDownload.bind(this)}>Download images</button>

                    <div className="storage-downloads">
                        {/* {imagesArray.map(function(url){
                         <a href={url}>image link</a>
                         })}
                         */}
                        {
                            imagesArray.map((item)=>(
                                <a download="ttn-app-image" href={item}>image link</a>
                            ))
                        }
                        {/*{
                         Object.keys(imagesArray).map(function(key) {
                         <a href={key}>image link</a>
                         })
                         }*/}
                    </div>

                    {/*<div className="storage-downloads">
                     <img src={this.state.imageUrl}
                     alt="downloaded-image"/>
                     </div>*/}
                </div>
            </div>
        );

    }
}

export default Storage;