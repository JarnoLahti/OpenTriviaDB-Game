function handler() {
  const { socket } = this;

  if (!socket.currentRoom) {
    return;
  }

  socket.to(socket.currentRoom).emit('room_message', {
    type: 'DISCONNECT',
    value: {
      id: socket.id,
      name: socket.name,
      timestamp: new Date().toISOString(),
    },
  });
  socket.currentRoom = null;
}

export default handler;
