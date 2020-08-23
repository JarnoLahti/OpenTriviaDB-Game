import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);
const asyncScan = promisify(client.scan).bind(client);
const asyncMGet = promisify(client.mget).bind(client);



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

async function getStaticRooms() {
  let cursor = '0';
  let rooms = [];

  do{
    const result = await asyncScan(cursor, 'MATCH', 'static-*');
    cursor = result[0];

    console.log(result);

    if(result[1].length > 0){
      const values = await asyncMGet(result[1]);
  
      values.forEach(v => {
        rooms.push(JSON.parse(v));
      })
    }
  }while(cursor !== '0');

  return rooms;
}

export default {
  getRoomById,
  setRoom,
  getStaticRooms
};
