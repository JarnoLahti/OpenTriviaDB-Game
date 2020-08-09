async function handler(payload) {
  const { io, socket } = this;

  if (!socket.currentRoom) {
    socket.emit('not_in_room');
    return;
  }

  io.to(socket.currentRoom).emit('room_message', {
    type: 'MESSAGE',
    value: {
      name: socket.name,
      timestamp: new Date().toISOString(),
      content: payload,
    },
  });
}

export default handler;
