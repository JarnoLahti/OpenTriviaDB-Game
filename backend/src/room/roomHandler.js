import RedisWrapper from '../lib/redisWrapper';
import { fetchQuestionSet } from '../lib/questionClientWrapper';

async function handler(roomId, io) {
  io.in(roomId).clients(async (err, clients) => {
    if (err) {
      console.log(err.toString());
      return;
    }

    const room = await getCurrentRoom(roomId);

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
      await RedisWrapper.asyncSet(roomId, JSON.stringify(room));
      return;
    }

    room.noClientsRetry = 0;

    const currentQuestion = room.questions[room.currentQuestion];

    const question = await handleQuestionChange(room);

    setTimeout(handleNextQuestion, 5000, io, roomId, question);

    io.in(roomId).emit('room_message', {
      type: 'CORRECT_ANSWER',
      value: {
        timestamp: new Date().toISOString(),
        questionId: currentQuestion.id,
        selectionId: currentQuestion.correctAnswerId,
      },
    });
  });
}

async function handleQuestionChange(room) {
  room.currentQuestion++;
  if (room.currentQuestion == room.questionsAmount) {
    //fetch new set of questions as old ones ran out
    const questionSetResult = await fetchQuestionSet(room.token, room.categoryId);

    if (questionSetResult.newToken) {
      room.token = questionSetResult.newToken;
    }

    room.questions = questionSetResult.questionSet;

    room.questionsAmount = room.questions.length;

    room.currentQuestion = 0;
  }

  const question = room.questions[room.currentQuestion];

  await RedisWrapper.asyncSet(room.id, JSON.stringify(room));

  return question;
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

async function getCurrentRoom(roomId) {
  const room = await RedisWrapper.asyncGet(roomId);

  if (!room) {
    console.log(`No room found with id: ${roomId}`);
    return null;
  }

  return JSON.parse(room);
}

export default handler;
