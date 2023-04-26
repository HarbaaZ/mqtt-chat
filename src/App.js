import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'
import mqtt from 'precompiled-mqtt'
import Chat from './components/chat';

function App() {
  const [client, setClient] = useState();
  const [isUserAuth, setIsUserAuth] = useState(false);
  const [name, setName] = useState('');

  const handleUserAuth = async () => {
    if (name.trim() !== '') {
      await connectToBrocker();
      setIsUserAuth(true)
    }
  }

  const connectToBrocker = async () => {
    try {
      const client = await mqtt.connect(
        'wss://7420d6065a7040db80383dfd7dd31e5c.s2.eu.hivemq.cloud:8884/mqtt',
        {
          username: 'mathis',
          password: 'aL2ykWyvPG!Ttw.',
          clientId: name,
          protocolId: 'MQTT',
        },
      );

      client.on('connect', () => {
        client.subscribe('general', { qos: 1 });
        client.subscribe('oneToOne/#');
        client.publish('general', `${name} joined the chat !`);
        setClient(client)
        console.log('Connected');
      });

      client.on('error', (err) => {
        console.log(err);
        toast.error('Error while connecting to the brocker')
      });

      client.on('close', () => {
        console.log('Connection closed');
        client.end();
        setName('');
        toast.error('Connection closed')
      });

    } catch (err) {
      console.log(err);
      toast.error('Error while connecting to the brocker')
    }
  }

  return (
    <>
      <Toaster
        position="top-left"
        reverseOrder={false}
      />
      {
        !client ?
          <div>
            <h1>Enter your name</h1>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={() => handleUserAuth()}>Submit</button>
          </div>
          : <Chat client={client} name={name} topic='general' />
      }
    </>
  );
}

export default App;
