import { isValidCallback } from "./validator.js";
import { sendMessage, editMessage } from "../services/message.service.js";

import { startHandler } from "../handlers/start.handler.js";
import { studyHandler, stopStudyHandler } from "../handlers/study.handler.js";
import {
  testStartHandler,
  answerHandler,
} from "../handlers/test.handler.js";

/**
 * =====================================
 * MAIN ROUTER (SINGLE SOURCE)
 * =====================================
 */
export async function routeUpdate(update, env) {
  /* ===============================
   * TEXT MESSAGE HANDLING
   * =============================== */
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    if (text === "/start") {
      return startHandler(chatId, env);
    }

    return sendMessage(chatId, "Use /start to open the menu.", env);
  }

  /* ===============================
   * CALLBACK QUERY HANDLING
   * =============================== */
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const userId = cb.from.id;
    const data = cb.data;

    /* ===============================
     * 🔥 PHASE-4 : ANSWERS FIRST
     * =============================== */
    if (data.startsWith("ANS_")) {
      const answer = data.replace("ANS_", "");
      return answerHandler(chatId, userId, answer, env);
    }

    /* ===============================
     * VALIDATE NON-ANSWER CALLBACKS
     * =============================== */
    if (!isValidCallback(data)) {
      return editMessage(chatId, messageId, "⚠️ Invalid action.", env);
    }

    /* ===============================
     * PHASE-3 : STUDY SYSTEM
     * =============================== */
    if (data === "MENU_STUDY") {
      return studyHandler(chatId, userId, env);
    }

    if (data === "STUDY_STOP") {
      return stopStudyHandler(chatId, userId, env);
    }

    /* ===============================
     * PHASE-4 : TEST SYSTEM
     * =============================== */
    if (data === "MENU_TEST") {
      return testStartHandler(chatId, userId, env);
    }

    /* ===============================
     * PLACEHOLDERS (FUTURE PHASES)
     * =============================== */
    const placeholderReplies = {
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

    const text =
      placeholderReplies[data] ||
      "Feature will be activated in next phase.";

    return editMessage(chatId, messageId, text, env);
  }
                       }
