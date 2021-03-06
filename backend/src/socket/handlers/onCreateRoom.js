import { v4 as uuid } from 'uuid';
import RedisWrapper from '../../lib/redisWrapper';

async function handler(payload) {
  const { socket } = this;

  const id = uuid();

  const { title, isPrivate, password, category } = payload;

  const room = {
    title,
    id,
    isPrivate,
    password,
    category,
  };

  await RedisWrapper.setRoom(room);

  socket.emit('room_created', { id });

  socket.to('lobby').emit('room_created', room);
}

export default handler;
