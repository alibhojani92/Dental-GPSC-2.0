import {
  startStudySession,
  stopStudySession,
  getActiveStudySession,
} from "../engine/timer.engine.js";
import { minutesBetween, getTodayDate } from "../utils/time.util.js";

/**
 * ENTRY POINT from router (Phase-1 callback MENU_STUDY)
 */
export async function studyHandler(chatId, userId, env) {
  const active = await getActiveStudySession(env.KV, userId);

  if (active) {
    return sendText(
      chatId,
      "📚 Study already running.\n\nPlease stop current session before starting a new one.",
      env
    );
  }

  // Phase-3: placeholder subject/topic
  const subjectId = 1;
  const topicId = 1;

  await startStudySession(env.KV, userId, subjectId, topicId);

  return sendText(
    chatId,
    "📚 Study started.\n\nTimer is running ⏱️",
    env
  );
}

/**
 * STOP STUDY (manual call later from button / command)
 */
export async function stopStudyHandler(chatId, userId, env) {
  const session = await stopStudySession(env.KV, userId);

  if (!session) {
    return sendText(chatId, "⚠️ No active study session found.", env);
  }

  const minutes = minutesBetween(
    session.startTimestamp,
    Date.now()
  );

  // Save FINAL time to D1
  await env.DB.prepare(
    `
    INSERT INTO study_logs (user_id, subject_id, topic_id, minutes, study_date)
    VALUES (?, ?, ?, ?, ?)
    `
  )
    .bind(
      userId,
      session.subjectId,
      session.topicId,
      minutes,
      getTodayDate()
    )
    .run();

  return sendText(
    chatId,
    `⏹️ Study stopped.\n\nTotal studied: ${minutes} minutes`,
    env
  );
}

/**
 * Local safe send (no circular import)
 */
async function sendText(chatId, text, env) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
                                         }
