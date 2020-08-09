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

app.post('/login', async (req, res) => {
  const { username } = req.body;

  const token = jwt.sign({ name: username }, 'secret');

  return res.status(200).json({ token: token });
});

httpServer.listen(PORT);

(async function () {
  const room = await createRoom('lobby', 'LOBBY', null, false);

  await RedisWrapper.asyncSet(room.id, JSON.stringify(room));

  setInterval(roomHandler, 10000, 'lobby', io);
})();
