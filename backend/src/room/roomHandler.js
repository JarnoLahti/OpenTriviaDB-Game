import RedisWrapper from '../lib/redisWrapper';
import { fetchQuestionSet } from '../lib/questionClientWrapper';

async function handler(roomId, io) {
  io.in(roomId).clients(async (err, clients) => {
    if (err) {
      console.log(err.toString());
      return;
    }

    let lastQuestion = null;

    let nextQuestion = null;

    try {
      await RedisWrapper.updateRoomTransaction(roomId, async (room) => {
        if (!room) {
          console.info(`Cleared interval for room ${room.title}`);
          clearInterval(this);
        }

        const noClients = clients.length <= 0;

        if (!room.removeIfEmpty && noClients) {
          //no need to do anything
          return false;
        }

        if (noClients && room.noClientsRetry == 5) {
          console.info(`Cleared interval for room ${room.title}`);
          clearInterval(this);
          return false;
        }

        room.lastHandled = new Date().toUTCString();

        if (noClients) {
          room.noClientsRetry++;
          return false;
        }

        room.noClientsRetry = 0;

        lastQuestion = room.currentQuestion;

        await handleQuestionChange(room);

        nextQuestion = room.currentQuestion;

        return true;
      });
    } catch (err) {
      throw err.error;
    }

    if (nextQuestion) {
      setTimeout(handleNextQuestion, 5000, io, roomId, nextQuestion);
    }

    if (lastQuestion) {
      let currentPoints = {};

      clients.forEach((c) => (currentPoints[c] = io.sockets.sockets[c].points));

      io.in(roomId).emit('room_message', {
        type: 'CORRECT_ANSWER',
        value: {
          question: {
            timestamp: new Date().toISOString(),
            questionId: lastQuestion.id,
            selectionId: lastQuestion.correctAnswerId,
          },
          currentPoints: currentPoints,
        },
      });
    }
  });
}

async function handleQuestionChange(room) {
  if (room.currentQuestionIdx == room.questionsAmount) {
    //fetch new set of questions as old ones ran out
    const questionSetResult = await fetchQuestionSet(room.token, room.categoryId);

    if (questionSetResult.newToken) {
      room.token = questionSetResult.newToken;
    }

    room.questions = questionSetResult.questionSet;

    room.questionsAmount = room.questions.length;

    room.currentQuestionIdx = 0;
  }

  room.currentQuestion = room.questions[room.currentQuestionIdx];

  room.answerSubmissionsMap = {};

  room.currentQuestionIdx++;
}

function handleNextQuestion(io, roomId, question) {
  io.in(roomId).emit('room_message', {
    type: 'QUESTION',
    value: {
      timestamp: new Date().toISOString(),
      id: question.id,
      question: question.question,
      selections: question.selections,
      difficulty: question.difficulty,
      points: question.points,
    },
  });
}

export default handler;
