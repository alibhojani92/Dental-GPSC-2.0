import { isValidCallback } from "./validator.js";
import { sendMessage, editMessage } from "../services/message.service.js";
import { startHandler } from "../handlers/start.handler.js";
import { studyHandler } from "../handlers/study.handler.js";
import { testStartHandler, answerHandler } from "../handlers/test.handler.js";

export async function routeUpdate(update, env) {
  // ---------- TEXT MESSAGE ----------
  if (update.message) {
    const text = update.message.text || "";
    const chatId = update.message.chat.id;
    const userId = update.message.from.id;

    if (text === "/start") {
      return startHandler(chatId, env);
    }

    return sendMessage(chatId, "Use /start to open the menu.", env);
  }

  // ---------- CALLBACK QUERY ----------
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const userId = cb.from.id;
    const data = cb.data;

    if (data === "MENU_TEST") {
  return testStartHandler(chatId, userId, env);
}

if (data.startsWith("ANS_")) {
  return answerHandler(chatId, userId, data.replace("ANS_", ""), env);
}

    if (!isValidCallback(data)) {
      return editMessage(chatId, messageId, "⚠️ Invalid action.", env);
    }

    // 🔗 PHASE-3 wiring (ONLY Study)
    if (data === "MENU_STUDY") {
      return studyHandler(chatId, userId, env);
    }

    // PHASE-1 placeholders for others
    const replyMap = {
      MENU_TEST: "📝 Test Zone\n\nFeature will be activated in next phase.",
      MENU_PERFORMANCE: "📊 Performance\n\nFeature will be activated in next phase.",
      MENU_REVISION: "🧠 Revision & Weak Areas\n\nFeature will be activated in next phase.",
      MENU_SCHEDULE: "⏰ Schedule & Target\n\nFeature will be activated in next phase.",
      MENU_STREAK: "🏆 Streak & Rank\n\nFeature will be activated in next phase.",
      MENU_SETTINGS: "⚙️ Settings\n\nFeature will be activated in next phase.",
      MENU_HELP: "ℹ️ Help\n\nFeature will be activated in next phase.",
    };

    const text = replyMap[data] || "Feature will be activated in next phase.";
    return editMessage(chatId, messageId, text, env);
  }
}
