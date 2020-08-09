import { fetchToken, fetchQuestionSet } from '../lib/questionClientWrapper';

async function createRoom(id, title, categoryId = null, removeIfEmpty = true) {
  const token = await fetchToken();

  const questionSetResult = await fetchQuestionSet(token, categoryId);

  const room = {
    id,
    token,
    questions: questionSetResult.questionSet,
    title,
    removeIfEmpty,
    categoryId,
    currentQuestion: 0,
    questionsAmount: questionSetResult.questionSet.length,
    noClientsRetry: 0,
  };

  return room;
}

export default createRoom;
