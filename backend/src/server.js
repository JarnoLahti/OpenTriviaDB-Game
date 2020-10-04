import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import socketIoInitialization from './socket/socket';
import jwt from 'jsonwebtoken';
import RedisWrapper from './lib/redisWrapper';
import createRoom from './room/createRoom';
import roomHandler from './room/roomHandler';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3001',
  })
);
app.use(bodyParser.json());
app.use('*', (req, res, next) => {
  console.log(`${req.method} :: ${req.originalUrl}`);
  next();
});

const httpServer = http.createServer(app);

const io = socketIoInitialization(httpServer);

app.get('/staticrooms', async (req, res) => {
  const rooms = await RedisWrapper.getStaticRooms();

  const roomResponse = rooms.map(r => ({
    id: r.id,
    title: r.title
  }));
  
  return res.status(200).json(roomResponse);
})

app.post('/login', async (req, res) => {
  const { username } = req.body;

  const token = jwt.sign({ name: username }, 'secret');

  return res.status(200).json({ token: token });
});

httpServer.listen(PORT);

(async function () {
  const random = await createRoom('static-random', 'RANDOM', null, false);
  const sport = await createRoom('static-sport', 'SPORT', 21, false);
  const movies = await createRoom('static-movies', 'MOVIES', 11, false);
  const music = await createRoom('static-music', 'MUSIC', 12, false);
  const science = await createRoom('static-science', 'SCIENCE', 17, false);
  const geography = await createRoom('static-geography', 'GEOGRAPHY', 22, false);

  await RedisWrapper.setRoom(random);
  await RedisWrapper.setRoom(sport);
  await RedisWrapper.setRoom(movies);
  await RedisWrapper.setRoom(music);
  await RedisWrapper.setRoom(science);
  await RedisWrapper.setRoom(geography);

  setInterval(roomHandler, 10000, random.id, io);
  setInterval(roomHandler, 10000, sport.id, io);
  setInterval(roomHandler, 10000, movies.id, io);
  setInterval(roomHandler, 10000, music.id, io);
  setInterval(roomHandler, 10000, science.id, io);
  setInterval(roomHandler, 10000, geography.id, io);
})();
