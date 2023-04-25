import React, { useState } from 'react';
import './App.css'
import mqtt from 'precompiled-mqtt'

function App() {
  const [client, setClient] = useState();

  const connectToBrocker = async () => {
    const client = await mqtt.connect(
      'wss://7420d6065a7040db80383dfd7dd31e5c.s2.eu.hivemq.cloud:8884/mqtt',
      {
        username: 'mathis',
        password: 'aL2ykWyvPG!Ttw.'
      },
    );
  
    client.on('connect', () => {
      setClient(client)
      console.log('Connected');
    });
  }

  connectToBrocker()

  return (
    <div className="App">
      Test
    </div>
  );
}

export default App;
