import RedisWrapper from '../../lib/redisWrapper';

async function handler(payload) {
  const { socket } = this;

  const { questionId, answerId } = payload;

  if (!socket.currentRoom) {
    socket.emit('error_message', { error: 'NOT_IN_ROOM' });
    return;
  }

  let isCorrectAnswer = false;

  let currentQuestionPoints = 0;

  let error = null;

  try {
    await RedisWrapper.updateRoomTransaction(socket.currentRoom, async (room) => {
      if (!room.currentQuestion) {
        error = 'QUESTION_NOT_INITIALIZED';
        return false;
      }
    
      if (room.currentQuestion.id !== questionId) {
        error = 'WRONG_QUESTION_SUBMIT';
        return false;
      }

      const answerSubmission = room.answerSubmissionsMap[socket.id];

      if (answerSubmission && answerSubmission === questionId) {
        error = 'ANSWER_ALREADY_SUBMITTED';
        return false;
      }

      room.answerSubmissionsMap[socket.id] = questionId;

      isCorrectAnswer = room.currentQuestion.correctAnswerId == answerId;

      currentQuestionPoints = room.currentQuestion.points

      return true;
    });
  } catch (error) {
    throw error.error;
  }

  if(error){
    socket.emit('error_message', { error });
    return;
  }

  socket.points = isCorrectAnswer ? socket.points + currentQuestionPoints : socket.points;

  const infoMessage = isCorrectAnswer ? `${socket.id} scored ${currentQuestionPoints}! New total ${socket.points}`:`${socket.id} answered incorrectly. Current points ${socket.points}`;

  console.info(infoMessage);
}

export default handler;
