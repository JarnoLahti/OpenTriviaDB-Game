import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Router, useNavigate } from '@reach/router';
import RoomView from './views/RoomView';
import CategorySelectionView from './views/CategorySelection';

function CreateRoomView() {
  const [room, setRoom] = useState({ name: 'title', capacity: 0 });
  const navigate = useNavigate();

  const onChange = (event) => {
    event.persist();
    const value = event.target.type === 'number' ? parseInt(event.target.value) : event.target.value;

    setRoom((curr) => ({ ...curr, [event.target.name]: value }));
  };

  const onSubmit = async () => {
    // const res = await client.post('/createroom', JSON.stringify(room));
    // if (res.status === 200) {
    //   navigate('/');
    // }
  };

  return (
    <React.Fragment>
      <input name="name" value={room.name} onChange={onChange} />
      <input name="capacity" type="number" value={room.capacity} onChange={onChange} step="1" />
      <button type="button" onClick={onSubmit}>
        create
      </button>
    </React.Fragment>
  );
}

function LoginView() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    // const result = await client.post('/login', JSON.stringify({ username: username }));
    // console.log(result.data.token);
    // localStorage.setItem('token', result.data.token);
    // navigate('/');
  };

  return (
    <React.Fragment>
      <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
      <button type="button" onClick={login}>
        login
      </button>
    </React.Fragment>
  );
}

function App() {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const s = io('http://localhost:3000');
    s.on('connection', s.emit('authenticate', { token: localStorage.getItem('token') }));
    s.on('authenticated', () => {
      setSocket(s);
    });
    s.on('unauthorized', () => {
      setSocket(null);
      navigate('/login');
    });
    return () => socket.disconnect();
  }, []);

  if (!socket) {
    return null;
  }

  return (
    <Router>
      <CategorySelectionView path="/" />
      <RoomView path="room/:id" socket={socket} />
      <CreateRoomView path="createroom" />
    </Router>
  );
}

function AppRouter() {
  return (
    <Router>
      <App path="/*" />
      <LoginView path="login" />
    </Router>
  );
}

export default AppRouter;
