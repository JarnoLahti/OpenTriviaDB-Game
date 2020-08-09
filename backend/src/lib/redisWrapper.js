import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);
const asyncKeys = promisify(client.keys).bind(client);

export default {
  asyncGet,
  asyncSet,
  asyncKeys,
};
