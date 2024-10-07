import React, { useEffect } from 'react';
import Pusher from 'pusher-js';

const PusherTest = () => {

    useEffect(() => {
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        // Initialize Pusher
        const pusher = new Pusher('6d50297c33411d7978b2', {
            cluster: 'ap1'
        });

        // Subscribe to the channel
        const channel = pusher.subscribe('my-channel');

        // Bind the event and alert the data when received
        channel.bind('my-event', function(data) {
            alert(JSON.stringify(data));
        });

        // Cleanup function to unsubscribe from channel when component unmounts
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    return (
        <div>
            <h1>Pusher Test</h1>
            <p>
                Try publishing an event to channel <code>notification</code> 
                with event name <code>test.notification</code>.
            </p>
        </div>
    );
};

export default PusherTest;
