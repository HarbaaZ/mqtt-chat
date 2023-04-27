import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const Chat = ({ client, name, topic, setTopics, setSelectedTopic, topics }) => {
    const [users, setUsers] = useState([])
    const [messageList, setMessageList] = useState([])
    const [message, setMessage] = useState('')

    useEffect(() => {
        messageList.forEach(message => {
            const selectedUser = message.replace(/ joined the chat !/, '')
            if (message.includes('joined the chat !') && !users.includes(selectedUser)) {
                const selectedUser = message.replace(/ joined the chat !/, '')
                setUsers(users => [...users, selectedUser])
            }

            if (message.includes('left the chat !') && !users.includes(selectedUser)) {
                const selectedUser = message.replace(/ left the chat !/, '')
                setUsers(users => users.filter(user => user !== selectedUser));
            }
        });
    }, [messageList, users]);

    const receiveMessage = (selectedTopic, message) => {
        if (message.toString().includes('invited you to a private chat !')) {
            const selectedUser = message.toString().replace(/ invited you to a private chat !/, '')
            if (selectedUser !== name) {
                const selectedTopic = `oneToOne/${selectedUser}/${name}`
                client.subscribe(selectedTopic)
                client.publish(selectedTopic, `${name} accepted your invitation !`)
                setTopics(topics => [...topics, `oneToOne/${selectedUser}/${name}`])
                toast(`Vous avez reçu une invitation de ${selectedUser}!`, {
                    icon: '👏',
                });
            }
        }

        if (message.toString().includes('accepted your invitation !')) {
            const selectedUser = message.toString().replace(/ accepted your invitation !/, '')
            if (selectedUser !== name) {
                toast(`${selectedUser} a accepté votre invitation !`, {
                    icon: '👏',
                });
                setTopics(topics => [...topics, `oneToOne/${name}/${selectedUser}`])
            }
        }

        if (selectedTopic === topic) {
            setMessageList(messageList => [...messageList, message.toString()])
        }
    }

    useEffect(() => {
        client.on('message', receiveMessage);

        return () => {
            client.removeListener('message', receiveMessage);
        };
    }, [client, topic]);

    useEffect(() => {
        setMessageList([]);
    }, [topic])

    const sendMessage = () => {
        client.publish(topic, `${topic} - ${name}: ${message}`)
        setMessage('');
    };

    const startOneToOne = (user) => {
        if (user !== name) {
            const selectedTopic = `oneToOne/${name}/${user}`
            client.subscribe(selectedTopic)
            client.publish(selectedTopic, `${name} invited you to a private chat !`)
        }
    }

    const leaveChat = () => {
        client.publish(topic, `${name} left the topic !`)
        client.unsubscribe(topic)
        setTopics(topics.filter(selectedTopic => selectedTopic !== topic))
        setSelectedTopic(0)
    }

    return (
        <>
            {
                messageList.map((message, index) => (
                    <div key={index}>
                        {message}
                    </div>
                ))
            }
            <input type='text' value={message} onChange={e => setMessage(e.target.value)} />
            <button onClick={() => sendMessage()}>Send</button>
            {
                topic !== 'general' && <button onClick={() => leaveChat()}>Leave</button>
            }
            <br />
            <h3>Online users</h3>
            {
                users.map((user, index) => (
                    <div key={index} onClick={() => startOneToOne(user)}>
                        {user}
                    </div>
                ))
            }
        </>
    )
}

export default Chat;