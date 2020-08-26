import RedisWrapper from '../../lib/redisWrapper';

async function handler(payload) {
  const { socket, io } = this;

  const { questionId, answerId } = payload;

  if (!socket.currentRoom) {
    socket.emit('error_message', { error: 'NOT_IN_ROOM' });
    return;
  }

  const room = await RedisWrapper.getRoomById(socket.currentRoom);

  if (!room.currentQuestion) {
    socket.emit('error_message', { error: 'QUESTION_NOT_INITIALIZED' });
    return;
  }

  if (room.currentQuestion.id !== questionId) {
    socket.emit('error_message', { error: 'WRONG_QUESTION_SUBMIT' });
    return;
  }

  const answerSubmission = room.answerSubmissionsMap[socket.id];

  if (answerSubmission && answerSubmission === questionId) {
    socket.emit('error_message', { error: 'ANSWER_ALREADY_SUBMITTED' });
    return;
  }

  room.answerSubmissionsMap[socket.id] = questionId;

  await RedisWrapper.setRoom(room);

  const isCorrectAnswer = room.currentQuestion.correctAnswerId == answerId;

  socket.points = isCorrectAnswer ? socket.points + room.currentQuestion.points : socket.points;

  const infoMessage = isCorrectAnswer ? `${socket.id} scored ${room.currentQuestion.points}! New total ${socket.points}`:`${socket.id} answered incorrectly. Current points ${socket.points}`;

  console.info(infoMessage);

  io.in(socket.currentRoom).emit('room_message', {
    type: 'ANSWER_SUBMIT',
    value: {
      id: socket.id,
      timestamp: new Date().toISOString(),
      name: socket.name,
      isCorrectAnswer,
    },
  });
}

export default handler;
