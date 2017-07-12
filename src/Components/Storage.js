
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
            linkDisplay:false
        }
    }

    onImageUploaderChange = (event) => {
        let that = this;
        console.log("image uploader",event.target.value);
        if(this.props.trip == ''){
            alert('please select a trip...');
        }
        else{
            let file = event.target.files[0];
            let storageRef = firebase.storage().ref('AppGallery/'+this.props.user+
                '/'+this.props.trip+
                '/'+file.name);
            let task = storageRef.put(file);
            task.on('state_changed',(snapshot) => {
                    let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.setState({
                        imageFile: file,
                        imageUploader: percentage
                    });
                },(error) =>{
                    alert('error occuring during state changed',error);
                },
                () => {
                    let imageURL = task.snapshot.downloadURL;
                    let rootRef = firebase.database().ref('trip/'+that.props.tripId);
                    rootRef.once('value',snapshot => {
                        if (snapshot.val().hasOwnProperty('imageFiles')) {
                            snapshot.ref.child('imageFiles').push({imageURL});
                            that.setState({
                                imageFile: '',
                                imageUploader: ''
                            })
                        } else {
                            snapshot.ref.update({imageFiles: []});
                            snapshot.ref.child('imageFiles').push({imageURL});
                            that.setState({
                                imageFile: '',
                            });
                        }
                        that.refs.uploader.value = '';
                    });
                }
            );
        }
    };

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
                })
            });
        }
        else{
            flag = 0;
        }

    };

    onImgDownload = () => {

        if(this.props.trip == ''){
            alert('Please select a trip to download images..');
        }
        else{
            alert('image selection for download complete...!');
            this.setState({
                imageUrl: this.state.localArray,
                linkDisplay:true
            });
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

    onImgDeleted = () => {

        let rootRef = firebase.database().ref('trip/'+this.props.tripId+'/imageFiles');
        if(this.props.trip == ''){
            alert('Please select a trip to delete images..');
        }
        else {
            alert('image selection complete...!');

            this.setState({
                imageUrlDelete: this.state.localArray
            }, () => {
                let imgDeletearray = [];
                imgDeletearray = this.state.imageUrlDelete;
                for(let i =0 ; i< imgDeletearray.length; i++){
                    console.log('image link for delete----',imgDeletearray[i]);
                    var deleteUrl = imgDeletearray[i].substring(imgDeletearray[i].lastIndexOf("/o/")+3,imgDeletearray[i].lastIndexOf("?"));
                    var decodedURL = decodeURIComponent(deleteUrl);
                    let storageRef = firebase.storage().ref(decodedURL);
                    storageRef.delete().then(function(){
                    }).catch(function(error){
                        console.log('error occured while deleting images',error);
                    });

                    var deleteImage = function (snap) {
                        console.log("snap in imageFiles",snap.key,snap.val())
                        if(imgDeletearray.indexOf(snap.val().imageURL) >=0){
                            rootRef.child(snap.key).remove();
                        }
                    };

                    rootRef.on("child_added",deleteImage);
                    rootRef.off("child_added",deleteImage)
                }
            })
        }
    };

    render(){
        console.log('this.props in storage component',this.props);
        let imagesArray = this.state.imageUrl;
        return(
            <div>
                <div className="image-upload-div">
                    Upload an image: <input type="file"
                                            name=""
                                            accept="image/*"
                                            id="fileButton"
                                            ref="uploader"
                                            onChange={this.onImageUploaderChange.bind(this)}/>

                    <progress value={this.state.imageUploader}
                              max="100"
                              id="uploader">{this.state.imageUploader}%</progress><br/>

                </div>

                <div className="download-div">
                    Download images:-
                    <div className="image-render">
                        {this.props.myImages.map((item)=>(
                            <Image source={item} imageSelector={this.onSelectImage.bind(this)}/>
                        ))}
                    </div>

                    <button className="common-btn download-btn" onClick={this.onImgDownload.bind(this)}>Download images</button>

                    <button className="common-btn download-btn" onClick={this.onImgDeleted.bind(this)}>Delete images</button>


                    {/*can't provide height and width as there are no
                    file metadata properties that allows us to do so in firebase storage*/}
                    <div className="storage-downloads">
                        {
                            imagesArray.map((item)=>(
                                <a download="ttn-app-image" href={item}>image link</a>
                            ))
                        }

                    </div>

                </div>
            </div>
        );

    }
}

export default Storage;

