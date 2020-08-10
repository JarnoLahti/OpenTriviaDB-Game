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
    currentQuestionIdx: 0,
    currentQuestion: null,
    answerSubmissionsMap: {},
    questionsAmount: questionSetResult.questionSet.length,
    noClientsRetry: 0,
  };

  return room;
}

export default createRoom;
