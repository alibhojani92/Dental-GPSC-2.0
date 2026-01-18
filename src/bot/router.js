import { studyHandler } from "../handlers/study.handler.js";
import { isValidCallback } from "./validator.js";
import { sendMessage, editMessage } from "../services/message.service.js";
import { startHandler } from "../handlers/start.handler.js";

export async function routeUpdate(update, env) {
  // Message (text)
  if (update.message) {
    const text = update.message.text || "";
    const chatId = update.message.chat.id;

    if (text === "/start") {
      return startHandler(chatId, env);
    }

    return sendMessage(chatId, "Use /start to open the menu.", env);
  }

  // Callback query
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const data = cb.data;

    if (!isValidCallback(data)) {
      return editMessage(chatId, messageId, "⚠️ Invalid action.", env);
    }

    // PHASE-1: placeholder replies only
    const replyMap = {
      MENU_STUDY: "📚 Study Zone\n\nFeature will be activated in next phase.",
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
// PHASE-3 wiring
if (data === "MENU_STUDY") {
  return studyHandler(chatId, cb.from.id, env);
}

// PHASE-1 placeholders remain for others
const text = replyMap[data] || "Feature will be activated in next phase.";
return editMessage(chatId, messageId, text, env);
