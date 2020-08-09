import React, { useReducer, useEffect } from 'react';
import { format } from 'date-fns';

const useRoom = (socket, roomId) => {
  const [state, dispatch] = useReducer(roomReducer, { messages: [], users: [], currentQuestion: null, correctAnswer: null });

  useEffect(() => {
    socket.emit('join_room', { roomId: roomId });
    socket.on('room_message', (payload) => {
      return dispatch({ type: payload.type, payload: payload.value });
    });

    return () => {
      socket.emit('leave_lobby');
    };
  }, [socket, roomId]);

  return state;
};

const roomReducer = (state, action) => {
  const { type, payload } = action;

  const timestamp = payload.timestamp ? format(new Date(payload.timestamp), 'HH:mm') : null;

  switch (type) {
    case 'MESSAGE':
      return { ...state, messages: [...state.messages, { type, timestamp, name: payload.name, content: payload.content }] };
    case 'QUESTION':
      return { ...state, currentQuestion: { type, timestamp, content: payload.question, selections: payload.selections }, correctAnswer: null };
    case 'CORRECT_ANSWER':
      return { ...state, correctAnswer: payload };
    case 'LEAVE':
      return { ...state, messages: [...state.messages, { type, timestamp, name: payload.name }], users: state.users.filter((u) => u.id !== payload.id) };
    case 'DISCONNECT':
      return { ...state, messages: [...state.messages, { type, timestamp, name: payload.name }], users: state.users.filter((u) => u.id !== payload.id) };
    case 'JOIN':
      return { ...state, messages: [...state.messages, { type, timestamp, name: payload.name }], users: [...state.users, { id: payload.id, name: payload.name }] };
    case 'CONNECTED_USERS':
      return { ...state, users: payload.map((p) => ({ id: p.id, name: p.name })) };
    default:
      return state;
  }
};

export default useRoom;
