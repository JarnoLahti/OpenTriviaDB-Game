import RedisWrapper from '../lib/redisWrapper';
import { fetchQuestionSet } from '../lib/questionClientWrapper';

async function handler(roomId, io) {
  io.in(roomId).clients(async (err, clients) => {
    if (err) {
      console.log(err.toString());
      return;
    }

    const room = await RedisWrapper.getRoomById(roomId);

    if (!room) {
      clearInterval(this);
    }

    const noClients = clients.length <= 0;

    if (!room.removeIfEmpty && noClients) {
      //no need to do anything
      return;
    }

    if (noClients && room.noClientsRetry == 5) {
      clearInterval(this);
      return;
    }

    room.lastHandled = new Date().toUTCString();

    if (noClients) {
      room.noClientsRetry++;
      await RedisWrapper.setRoom(room);
      return;
    }

    room.noClientsRetry = 0;

    const lastQuestion = room.currentQuestion;

    const nextQuestion = await handleQuestionChange(room);

    setTimeout(handleNextQuestion, 5000, io, roomId, nextQuestion);

    if (lastQuestion) {
      io.in(roomId).emit('room_message', {
        type: 'CORRECT_ANSWER',
        value: {
          timestamp: new Date().toISOString(),
          questionId: lastQuestion.id,
          selectionId: lastQuestion.correctAnswerId,
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

  await RedisWrapper.setRoom(room);

  return room.currentQuestion;
}

async function handleNextQuestion(io, roomId, question) {
  io.in(roomId).emit('room_message', {
    type: 'QUESTION',
    value: {
      timestamp: new Date().toISOString(),
      id: question.id,
      question: question.question,
      selections: question.selections,
    },
  });
}

export default handler;
