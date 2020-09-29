import React , {useEffect,useState} from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Pusher from 'pusher-js';
import axios from './axios';

function App() {

  const [messages, setMessages] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:9000/message/sync')
      .then((response) => {
        setMessages(response.data);
      })
  },[])

  useEffect(() => {
    const pusher = new Pusher('62250ca021cbc289a844', {
      cluster: 'eu'
    });
    
    const channel = pusher.subscribe('messages');
    console.log(channel);
    channel.bind('inserted', (data) => {
      setMessages([...messages,data]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[messages]);

  console.log(messages);


  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages = {messages}/>
      </div>
    </div>
  );
}

export default App;
