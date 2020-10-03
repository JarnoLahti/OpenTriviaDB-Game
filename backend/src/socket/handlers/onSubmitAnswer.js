import RedisWrapper from '../../lib/redisWrapper';

async function handler(payload) {
  const { socket, io } = this;

  const { questionId, answerId } = payload;

  if (!socket.currentRoom) {
    socket.emit('error_message', { error: 'NOT_IN_ROOM' });
    return;
  }

  let isCorrectAnswer = false;

  let currentQuestionPoints = 0;

  try {
    await RedisWrapper.updateRoomTransaction(socket.currentRoom, async (room) => {
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

      isCorrectAnswer = room.currentQuestion.correctAnswerId == answerId;

      currentQuestionPoints = room.currentQuestion.points
    });
  } catch (error) {
    throw error.error;
  }

  socket.points = isCorrectAnswer ? socket.points + currentQuestionPoints : socket.points;

  const infoMessage = isCorrectAnswer ? `${socket.id} scored ${currentQuestionPoints}! New total ${socket.points}`:`${socket.id} answered incorrectly. Current points ${socket.points}`;

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
