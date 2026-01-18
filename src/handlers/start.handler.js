import { sendMessage } from "../services/message.service.js";
import { WELCOME_MESSAGE } from "../bot/messages.js";
import { mainMenuKeyboard } from "../bot/keyboards.js";

export async function startHandler(chatId, env) {
  return sendMessage(chatId, WELCOME_MESSAGE, env, mainMenuKeyboard());
}
