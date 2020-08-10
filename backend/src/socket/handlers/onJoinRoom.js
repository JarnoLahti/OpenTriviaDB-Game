import RedisWrapper from '../../lib/redisWrapper';

async function handler(payload) {
  const { io, socket } = this;

  const { roomId } = payload;

  const room = await RedisWrapper.getRoomById(roomId);

  if (!room) {
    socket.emit('error_message', {
      type: 'ROOM_NOT_FOUND',
      value: `Room with Id ${roomId} not found`,
    });
  }

  io.in(roomId).clients((err, clients) => {
    if (err) {
      socket.emit('unable_to_join_room');
    }

    if (clients.find((c) => c === socket.id)) {
      socket.emit('already_in_room');
    }

    socket.join(roomId, () => {
      socket.to(roomId).emit('room_message', {
        type: 'JOIN',
        value: {
          id: socket.id,
          name: socket.name,
          timestamp: new Date().toISOString(),
        },
      });

      const currentUsers = clients.map((id) => {
        return {
          id: id,
          name: io.sockets.connected[id].name,
        };
      });
      socket.currentRoom = roomId;
      io.to(roomId).emit('room_message', {
        type: 'CONNECTED_USERS',
        value: [...currentUsers, { id: socket.id, name: socket.name }],
      });
    });
  });
}

export default handler;
