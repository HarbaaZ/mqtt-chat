import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'
import mqtt from 'precompiled-mqtt'
import Chat from './components/chat'

function App() {
  const [client, setClient] = useState()
  const [name, setName] = useState('')
  const [topics, setTopics] = useState(['general'])
  const [topic, setTopic] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(0)

  const handleUserAuth = async () => {
    if (name.trim() !== '') {
      await connectToBrocker();
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
        client.subscribe('general', { qos: 1 })
        client.subscribe('oneToOne/#')
        client.publish('general', `${name} joined the chat !`)
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
      console.log(err)
      toast.error('Error while connecting to the brocker')
    }
  }

  const subscibeNewTopic = () => {
    if (topic.trim() !== '' && !topics.includes(topic)) {
      setTopics([...topics, topic])
      setTopic('')
      client.subscribe(topic, { qos: 1 });
      client.publish(topic, `${name}: vient de se connecter au topic ${topic}`);
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
          : <div>
            <h1>{topics[selectedTopic]}</h1>

            <Chat client={client} name={name} topic={topics[selectedTopic]} />
            {
              topics.map((topic, index) => (
                <div key={index} onClick={() => setSelectedTopic(index)}>
                  {topic}
                </div>
              ))
            }
            <h3>Create a topic</h3>
            <input type='text' value={topic} onChange={(e) => setTopic(e.target.value)} />
            <button onClick={() => subscibeNewTopic()}>Create</button>
          </div>
      }
    </>
  );
}

export default App;
