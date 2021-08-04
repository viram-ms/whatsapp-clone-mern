import { Avatar } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import './SidebarChat.css';
import db from './firebase';
import {Link} from 'react-router-dom'; 


function SidebarChat({id, name, addNewChat}) {

    const [lastmessage, setLastMessage] = useState('');

    useEffect(() => {
        if(id){
            db.collection('Rooms').doc(id).collection('messages')
            .orderBy('timestamp','desc')
            .onSnapshot(snapshot => (
                setLastMessage(snapshot.docs.map((doc) => (
                    doc.data())))
            ))
        }
    },[id])

    const createChat = () => {
        const chatRoom = prompt("Please enter name for chat room");

        if(chatRoom) {
            db.collection('Rooms').add({
                name: chatRoom,
            });
        }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="SidebarChat">
                <Avatar />
                <div className="SidebarChat__info">
                    <h2>{name}</h2>
                    <p>{lastmessage[0]?.message}</p>
                </div>
            </div>
        </Link>
    ):(
        <div onClick={createChat} className="SidebarChat">
                <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat
