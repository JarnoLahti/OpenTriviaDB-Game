import axios from 'axios';
import { v4 as uuid } from 'uuid';

const questionClient = axios.create({
  baseURL: 'https://opentdb.com/api.php',
  headers: { 'Content-Type': 'application/json' },
});

const tokenClient = axios.create({
  baseURL: 'https://opentdb.com/api_token.php',
  headers: { 'Content-Type': 'application/json' },
});


const questionDifficultyPoints = {
  'easy': {
    points: 100
  },
  'medium': {
    points: 275
  },
  'hard': {
    points: 500
  }
}

export async function fetchToken() {
  const response = await tokenClient.get(null, {
    params: { command: 'request' },
  });

  if (response.data.response_code !== 0) {
    throw new Error("Couldn't get question token");
  }

  return response.data.token;
}

export async function fetchQuestionSet(token, category = null) {
  let newToken = null;

  let params = {
    token,
    amount: 3,
    type: 'multiple',
  };

  if (category) {
    params = { ...params, category };
  }

  let questionsResponse = await questionClient.get(null, { params });

  if (questionsResponse.data.response_code === 4) {
    newToken = await fetchToken();

    params = { ...params, token: newToken };

    questionsResponse = await questionClient.get(null, { params });
  }

  const correctAnswerId = uuid();
  const questionSet = questionsResponse.data.results.map((q, index) => ({
    index,
    question: q.question,
    id: uuid(),
    difficulty: q.difficulty,
    points: questionDifficultyPoints[q.difficulty].points,
    correctAnswer: q.correct_answer,
    correctAnswerId: correctAnswerId,
    selections: [
      ...q.incorrect_answers.map((a) => ({ id: uuid(), answer: a })),
      { id: correctAnswerId, answer: q.correct_answer },
    ].sort((a, b) => (a.answer < b.answer ? 1 : -1)),
  }));

  return {
    questionSet,
    newToken,
  };
}
