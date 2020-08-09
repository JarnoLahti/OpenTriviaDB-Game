import onCreateRoom from './onCreateRoom';
import onJoinRoom from './onJoinRoom';
import onChatMessage from './onChatMessage';
import onLeave from './onLeave';
import onDisconnecting from './onDisconnecting';

function onAuthenticated(socket) {
  const { io } = this;
  socket.name = socket.decoded_token.name;
  socket.on('create_room', onCreateRoom.bind({ socket }));
  socket.on('chat_message', onChatMessage.bind({ io, socket }));
  socket.on('join_room', onJoinRoom.bind({ io, socket }));
  socket.on('leave', onLeave.bind({ socket }));
  socket.on('leave_room', onLeave.bind({ socket }));
  socket.on('disconnecting', onDisconnecting.bind({ socket }));
}

export default onAuthenticated;
