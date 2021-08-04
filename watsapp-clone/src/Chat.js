import { Avatar, IconButton } from '@material-ui/core';
import React, {useState, useEffect} from 'react'
import './Chat.css';
import AttachFile from '@material-ui/icons/AttachFile';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import MoreVert from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios';
import {useParams} from 'react-router-dom';
import db from './firebase';
import {useStateValue} from './stateProvider';
import firebase from 'firebase';

function Chat({messages}) {

    const [input,setInput] = useState('');
    const {roomId} = useParams();
    const [roomName,setRoomName] = useState('');
    const [firebaseMessage, setFireBaseMessage] = useState([]);
    const [{user}, dispatch] = useStateValue();

    useEffect(() => {
        if(roomId) {
            db.collection('Rooms').doc(roomId).onSnapshot(snapshot => (
                setRoomName(snapshot.data().name)
            ))
            db.collection('Rooms').doc(roomId).
            collection('messages').orderBy('timestamp','asc').onSnapshot(snapshot => {
                console.log(snapshot)
                setFireBaseMessage(snapshot.docs.map(doc => doc.data()))
            })
        }

    },[roomId]);

    const sendMessage = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:9000/message/new',
        {
            message: input,
            name: "viram",
            timestamp: "just now",
            received: false
        });
        setInput('');
    };

    const sendMessageToFireBase = (e) => {
        e.preventDefault();
        
        db.collection('Rooms').doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setInput('');
    }

    console.log(firebaseMessage, roomName);

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />

                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last Seen at {new Date(firebaseMessage[firebaseMessage.length - 1]?.timestamp?.toDate()).toUTCString()}</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {firebaseMessage.map(message => (
                <p className={`chat__message ${message.name === user.displayName && "chat__receiver"}`}>
                    <span className="chat__name">{message.name}</span>
                    {message.message}
                    <span className="chat__timestamp">
                        {new Date(message.timestamp?.toDate()).toUTCString()}
                    </span>
                </p>
                ))}
            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" type="text" />
                    <button onClick={sendMessageToFireBase} type="submit">Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
