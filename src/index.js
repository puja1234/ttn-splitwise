import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import * as firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBkZxFcul0f4uoj5dXbyF1dSWXs418P80w",
    authDomain: "ttn-splitwise.firebaseapp.com",
    databaseURL: "https://ttn-splitwise.firebaseio.com",
    projectId: "ttn-splitwise",
    storageBucket: "ttn-splitwise.appspot.com",
    messagingSenderId: "50949304873"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
