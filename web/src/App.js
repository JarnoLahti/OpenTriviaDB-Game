import React, { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { Router, Link, useParams, useNavigate } from '@reach/router';
import axios from 'axios';
import LobbyView from './views/LobbyView';

const client = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

function RoomView() {
  const params = useParams();
  const socket = useRef(null);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.current = io('http://localhost:3000');
    socket.current.emit('join_room', { payload: params.id });
    socket.current.on('connected_users', (data) => {
      setUserList(data.payload);
    });
    socket.current.on('user_left_room', (data) => {
      setUserList((curr) => curr.filter((c) => c !== data.payload));
    });
    socket.current.on('room_not_found', () => {
      window.alert('ROOM NOT FOUND');
      navigate('/');
    });
    socket.current.on('room_full', () => {
      window.alert('ROOM FULL');
      navigate('/');
    });
    return () => socket.current.disconnect();
  }, [params.id]);

  return (
    <React.Fragment>
      <Link to="/">to room selection...</Link>
      <ul>
        {userList.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>
    </React.Fragment>
  );
}

function CreateRoomView() {
  const [room, setRoom] = useState({ name: 'title', capacity: 0 });
  const navigate = useNavigate();

  const onChange = (event) => {
    event.persist();
    const value = event.target.type === 'number' ? parseInt(event.target.value) : event.target.value;

    setRoom((curr) => ({ ...curr, [event.target.name]: value }));
  };

  const onSubmit = async () => {
    const res = await client.post('/createroom', JSON.stringify(room));
    if (res.status === 200) {
      navigate('/');
    }
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

function RoomSelectView() {
  const [roomList, setRoomList] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const result = await client.get('/rooms');
      setRoomList(result.data);
    }
    fetchData();
  }, [refreshCount]);

  const refresh = useCallback(() => {
    setRefreshCount((curr) => curr + 1);
  }, [setRefreshCount]);

  return (
    <React.Fragment>
      <button type="button" onClick={refresh}>
        refresh rooms...
      </button>
      <ul>
        {roomList.map((r) => (
          <li key={r.id}>
            <Link to={`/join/${r.id}`}>{r.name}</Link>
          </li>
        ))}
        <li>
          <Link to="/createroom">create new room...</Link>
        </li>
      </ul>
    </React.Fragment>
  );
}

function LoginView() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    const result = await client.post('/login', JSON.stringify({ username: username }));
    console.log(result.data.token);
    localStorage.setItem('token', result.data.token);
    navigate('/');
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
      <LobbyView path="/" socket={socket} />
      <CreateRoomView path="/createroom" />
      <RoomView path="/join/:id" />
    </Router>
  );
}

function AppRouter() {
  return (
    <Router>
      <App path="/" />
      <LoginView path="/login" />
    </Router>
  );
}

export default AppRouter;
