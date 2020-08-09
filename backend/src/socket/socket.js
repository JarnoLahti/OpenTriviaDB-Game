import socketio from 'socket.io';
import socketioJwt from 'socketio-jwt';
import onAuthenticated from './handlers/onAuthenticated';

function init(server) {
  const io = socketio(server);

  io.on(
    'connection',
    socketioJwt.authorize({
      secret: 'secret',
      timeout: 15000,
    })
  );
  io.on('authenticated', onAuthenticated.bind({ io }));
  return io;
}

export default init;
