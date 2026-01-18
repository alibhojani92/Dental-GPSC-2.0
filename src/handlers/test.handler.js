import {
  startTest,
  getActiveTest,
  recordAnswer,
} from "../engine/test.engine.js";
import { getMotivation } from "../engine/motivation.engine.js";

async function send(chatId, text, env, markup = null) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: markup,
    }),
  });
}

export async function testStartHandler(chatId, userId, env) {
  // Placeholder MCQs (real fetch comes later)
  const questions = [
    {
      id: 1,
      question: "Dentigerous cyst is associated with?",
      options: ["Impacted tooth", "Deciduous tooth", "Exfoliated tooth", "Supernumerary tooth"],
      correct_option: "Impacted tooth",
      explanation: "It forms around the crown of an unerupted tooth.",
    },
  ];

  const res = await startTest(env.KV, userId, "DAILY", questions);
  if (res.alreadyRunning) {
    return send(chatId, "📝 Test already running.", env);
  }

  return send(
    chatId,
    `📝 Test Started\n\nQ1. ${questions[0].question}${getMotivation("START")}`,
    env,
    {
      inline_keyboard: questions[0].options.map((o) => [
        { text: o, callback_data: `ANS_${o}` },
      ]),
    }
  );
}

export async function answerHandler(chatId, userId, answer, env) {
  const res = await recordAnswer(env.KV, userId, answer);
  if (!res) {
    return send(chatId, "⚠️ No active test.", env);
  }

  const last = res.test.results.at(-1);
  let text = "";

  if (last.is_time_up) {
    text =
      `⏱️ Time Over\n\nCorrect: ${res.test.questions[res.test.index - 1].correct_option}` +
      `\n🧠 Explanation: ${res.test.questions[res.test.index - 1].explanation}` +
      getMotivation("TIMEUP");
  } else if (last.is_correct) {
    text =
      `✅ Correct Answer\n\n🧠 Explanation: ${res.test.questions[res.test.index - 1].explanation}` +
      getMotivation("CORRECT");
  } else {
    text =
      `❌ Wrong Answer\n\nCorrect: ${res.test.questions[res.test.index - 1].correct_option}` +
      `\n🧠 Explanation: ${res.test.questions[res.test.index - 1].explanation}` +
      getMotivation("WRONG");
  }

  if (res.finished) {
    return send(chatId, text + "\n\n🏁 Test Completed" + getMotivation("END"), env);
  }

  const q = res.test.questions[res.test.index];
  return send(
    chatId,
    text + `\n\nQ${res.test.index + 1}. ${q.question}`,
    env,
    {
      inline_keyboard: q.options.map((o) => [
        { text: o, callback_data: `ANS_${o}` },
      ]),
    }
  );
}
