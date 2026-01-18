import {
  startTest,
  getActiveTest,
  recordAnswer,
} from "../engine/test.engine.js";
import { getMotivation } from "../engine/motivation.engine.js";

async function send(chatId, text, env, markup = null) {
  try {
    await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          reply_markup: markup,
        }),
      }
    );
  } catch (e) {
    console.error("send failed", e);
  }
}

/* ===============================
 * START TEST
 * =============================== */
export async function testStartHandler(chatId, userId, env) {
  const questions = [
    {
      id: 1,
      question: "Dentigerous cyst is associated with?",
      options: [
        "Impacted tooth",
        "Deciduous tooth",
        "Exfoliated tooth",
        "Supernumerary tooth",
      ],
      correct_option: "Impacted tooth",
      explanation:
        "Dentigerous cyst develops around the crown of an unerupted tooth.",
    },
  ];

  const res = await startTest(env.KV, userId, "DAILY", questions);

  if (res.alreadyRunning) {
    await send(chatId, "📝 Test already running.", env);
    return;
  }

  const q = questions[0];

  await send(
    chatId,
    `📝 Test Started\n\nQ1. ${q.question}${getMotivation("START")}`,
    env,
    {
      inline_keyboard: q.options.map((o) => [
        { text: o, callback_data: `ANS_${o}` },
      ]),
    }
  );
}

/* ===============================
 * ANSWER HANDLER (ONLY ONE!)
 * =============================== */
export async function answerHandler(chatId, userId, answer, env) {
  const res = await recordAnswer(env.KV, userId, answer);

  if (!res) {
    await send(chatId, "⚠️ No active test.", env);
    return;
  }

  const test = res.test;
  const last = test.results[test.results.length - 1];
  const q = test.questions[test.index - 1];

  let text = "";

  if (last.is_time_up) {
    text =
      `⏱️ Time Over\n\nCorrect: ${q.correct_option}\n🧠 Explanation: ${q.explanation}` +
      getMotivation("TIMEUP");
  } else if (last.is_correct) {
    text =
      `✅ Correct Answer\n\n🧠 Explanation: ${q.explanation}` +
      getMotivation("CORRECT");
  } else {
    text =
      `❌ Wrong Answer\n\nCorrect: ${q.correct_option}\n🧠 Explanation: ${q.explanation}` +
      getMotivation("WRONG");
  }

  if (res.finished) {
    await send(
      chatId,
      text + "\n\n🏁 Test Completed" + getMotivation("END"),
      env
    );
    return;
  }

  const nextQ = test.questions[test.index];

  await send(
    chatId,
    text + `\n\nQ${test.index + 1}. ${nextQ.question}`,
    env,
    {
      inline_keyboard: nextQ.options.map((o) => [
        { text: o, callback_data: `ANS_${o}` },
      ]),
    }
  );
}
