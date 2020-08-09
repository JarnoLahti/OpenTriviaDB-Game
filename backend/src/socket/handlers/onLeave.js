function handler() {
  const { socket } = this;

  if (!socket.currentRoom) {
    socket.emit('not_in_room');
  }

  socket.leave(socket.currentRoom, () => {
    socket.to(socket.currentRoom).emit('room_message', {
      type: 'LEAVE',
      value: {
        id: socket.id,
        name: socket.name,
        timestamp: new Date().toISOString(),
      },
    });
    socket.currentRoom = null;
  });
}

export default handler;
