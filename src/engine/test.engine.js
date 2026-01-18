import { getTodayDate } from "../utils/time.util.js";

const TEST_KEY = "active_test:";
const QUESTION_TIME_MS = 5 * 60 * 1000; // 5 minutes

export async function startTest(KV, userId, testType, questions) {
  const key = TEST_KEY + userId;

  const existing = await KV.get(key);
  if (existing) {
    return { alreadyRunning: true };
  }

  const payload = {
    testType,
    questions,
    index: 0,
    startTime: Date.now(),
    questionStart: Date.now(),
    results: [],
  };

  await KV.put(key, JSON.stringify(payload));
  return { started: true };
}

export async function getActiveTest(KV, userId) {
  const raw = await KV.get(TEST_KEY + userId);
  return raw ? JSON.parse(raw) : null;
}

export async function recordAnswer(KV, userId, answer) {
  const key = TEST_KEY + userId;
  const test = await getActiveTest(KV, userId);
  if (!test) return null;

  const q = test.questions[test.index];
  const isTimeUp =
    Date.now() - test.questionStart > QUESTION_TIME_MS;

  const isCorrect = !isTimeUp && answer === q.correct_option;

  test.results.push({
    mcq_id: q.id,
    selected: answer,
    is_correct: isCorrect ? 1 : 0,
    is_time_up: isTimeUp ? 1 : 0,
    date: getTodayDate(),
  });

  test.index++;
  test.questionStart = Date.now();

  if (test.index >= test.questions.length) {
    await KV.delete(key);
    return { finished: true, test };
  }

  await KV.put(key, JSON.stringify(test));
  return { next: true, test };
    }
