import { sendMessage, editMessage } from "../services/message.service.js";
import { startHandler } from "../handlers/start.handler.js";
import { studyHandler, stopStudyHandler } from "../handlers/study.handler.js";
import {
  testStartHandler,
  answerHandler,
} from "../handlers/test.handler.js";
import { isValidCallback } from "./validator.js";

export async function routeUpdate(update, env) {
  /* ===============================
   * TEXT MESSAGE
   * =============================== */
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    if (text === "/start") {
      await startHandler(chatId, env);
      return;
    }

    await sendMessage(chatId, "Use /start to open the menu.", env);
    return;
  }

  /* ===============================
   * CALLBACK QUERY
   * =============================== */
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const userId = cb.from.id;
    const data = cb.data;

    /* 🔥 ABSOLUTE FIRST: ANSWERS */
    if (data && data.startsWith("ANS_")) {
      const answer = data.slice(4);
      await answerHandler(chatId, userId, answer, env);
      return;
    }

    /* VALIDATE ONLY NON-ANSWER CALLBACKS */
    if (!isValidCallback(data)) {
      await editMessage(chatId, messageId, "⚠️ Invalid action.", env);
      return;
    }

    /* STUDY */
    if (data === "MENU_STUDY") {
      await studyHandler(chatId, userId, env);
      return;
    }

    if (data === "STUDY_STOP") {
      await stopStudyHandler(chatId, userId, env);
      return;
    }

    /* TEST */
    if (data === "MENU_TEST") {
      await testStartHandler(chatId, userId, env);
      return;
    }

    /* PLACEHOLDERS */
    const placeholders = {
      MENU_PERFORMANCE:
        "📊 Performance\n\nFeature will be activated in next phase.",
      MENU_REVISION:
        "🧠 Revision & Weak Areas\n\nFeature will be activated in next phase.",
      MENU_SCHEDULE:
        "⏰ Schedule & Target\n\nFeature will be activated in next phase.",
      MENU_STREAK:
        "🏆 Streak & Rank\n\nFeature will be activated in next phase.",
      MENU_SETTINGS:
        "⚙️ Settings\n\nFeature will be activated in next phase.",
      MENU_HELP:
        "ℹ️ Help\n\nFeature will be activated in next phase.",
    };

    await editMessage(
      chatId,
      messageId,
      placeholders[data] || "Feature will be activated in next phase.",
      env
    );
    return;
  }
      }
