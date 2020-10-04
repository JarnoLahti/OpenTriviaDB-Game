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

async function updateRoomTransaction(roomId, updateFn) {
  return new Promise((resolve, reject) => {
    client.watch(roomId, (watchError) => {
      if(watchError){
        return reject({ data: null, error: watchError });
      }

      client.get(roomId, async (getError, result) => {
        if(getError){
          return reject({ data: null, error: getError });
        }

        let roomObj = JSON.parse(result);
        
        let shouldUpdate = false;
        try {
          shouldUpdate = await updateFn(roomObj);
        } catch (error) {
          console.error(`TRANSACTION UPDATE FN FAILED: ${error} DISCARDING`);
          client.unwatch();
          return;
        }

        if(!shouldUpdate){
          client.unwatch();
          return;
        }

        client
        .multi()
        .set(roomId, JSON.stringify(roomObj))
        .exec((execError, results) => {
          if(execError){
            reject({ data: null, error: execError })
          }
          resolve({ data: results, error: null })
        });
      });
    });
  });
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
  updateRoomTransaction,
  getStaticRooms
};
