import React , {useEffect,useState} from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './login';
import Pusher from 'pusher-js';
import axios from './axios';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import { useStateValue } from './stateProvider';

function App() {

  const [{user}, dispatch] = useStateValue();

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
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">

        <Router>
          <Sidebar />
          <Switch>
             <Route path="/rooms/:roomId">
              <Chat messages = {messages}/>
            </Route> 
          </Switch>
        </Router>
      </div>
      )}
      
    </div>
  );
}

export default App;
