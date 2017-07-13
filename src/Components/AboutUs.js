import React, { Component } from 'react';

export default function AboutUs() {
    return (
        <div className="no-trip">
            <h4>TTN-SPLITWISE</h4>
            <p>-><span>TTN-SPLITWISE</span> is an application which let's the user to keep track of all the expenditure
                he/she made.</p>
            <p>->Initially user details are visible on the left-side panel.The user can choose from his/her trips.</p>
            <p>->Upon selecting a trip, all the transactions made by them and others on the trip is visible.</p>
            <p>->He/She can also generate bills when adding a new expense.</p>
            <p>->Amount to be given or recieved by the user is visible on the my expense block on the right.</p>
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbF5NqYnHs5Rmt3Xh3cXWw67Ckmg_oK6tkD2tiKfXYC6E3BCTG"
                alt="Home img"/>
        </div>
    );
}
