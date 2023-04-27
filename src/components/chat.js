import React, { useState, useEffect } from 'react'

const Chat = ({ client, name, topic }) => {
    const [users, setUsers] = useState([])
    const [messageList, setMessageList] = useState([])
    const [message, setMessage] = useState('')

    useEffect(() => {
        messageList.forEach(message => {
            const selectedUser = message.replace(/ joined the chat !/, '')
            if (message.includes('joined the chat !') && !users.includes(selectedUser)) {
                const selectedUser = message.replace(/ joined the chat !/, '')
                setUsers([...new Set(users), selectedUser])
            }

            if (message.includes('left the chat !') && !users.includes(selectedUser)) {
                const selectedUser = message.replace(/ left the chat !/, '')
                setUsers(users => users.filter(user => user !== selectedUser));
            }
        });
    }, [messageList, users]);

    useEffect(() => {
        client.on('message', (selectedTopic, message) => {
            if (selectedTopic === topic) {
                setMessageList(messageList => [...messageList, message.toString()])
            }
        });
    }, [client, messageList, topic]);

    useEffect(() => {
        if (messageList.length > 1) {
            if (messageList[messageList.length - 1] === messageList[messageList.length - 2]) {
                setMessageList(messageList => messageList.filter((message, index) => index !== messageList.length - 1))
            }
        }
    }, [messageList])

    const sendMessage = () => {
        client.publish(topic, `${topic} ${name}: ${message}`)
        setMessage('');
    };

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
            <br />
            Online users
            {
                users.map((user, index) => (
                    <div key={index}>
                        {user}
                    </div>
                ))
            }
        </>
    )
}

export default Chat;