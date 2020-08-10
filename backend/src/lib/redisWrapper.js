import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);

async function setRoom(room) {
  await asyncSet(room.id, JSON.stringify(room));
}

async function getRoomById(roomId) {
  const room = await asyncGet(roomId);

  if (!room) {
    console.log(`No room found with id: ${roomId}`);
    return null;
  }

  return JSON.parse(room);
}

export default {
  getRoomById,
  setRoom,
};
