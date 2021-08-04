import React , {useEffect, useState} from 'react';
import "./Sidebar.css";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import {Avatar, IconButton} from '@material-ui/core'; 
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import SidebarChat from './SidebarChat';
import db from './firebase';
import {useStateValue} from './stateProvider';

function Sidebar() {
    const [rooms, setRooms] = useState([]);
    const [{user,dispatch}] = useStateValue();
    useEffect(() => {
        db.collection('Rooms').onSnapshot(snapshot => (
            setRooms(snapshot.docs.map(doc => (
                {
                    id: doc.id,
                    data: doc.data(),
                }
            )))
        ))

        // return () => {
        //     unsubscribe();
        // }
    },[]);

    

    return (
        <div className="sidebar">
            {/* <h1>I am a sidebar</h1> */}
            <div className="sidebar__header">
                <Avatar src={user?.photoURL} />
                <div className="div.sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchIcon />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat />
                {rooms.map(room => (
                    <SidebarChat key={room.id} id={room.id} name={room.data.name}/>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
