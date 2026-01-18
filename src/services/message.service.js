export async function sendMessage(chatId, text, env, reply_markup) {
  try {
    await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          reply_markup,
        }),
      }
    );
  } catch (err) {
    console.error("sendMessage failed:", err);
  }
}

export async function editMessage(chatId, messageId, text, env, reply_markup) {
  try {
    await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/editMessageText`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text,
          reply_markup,
        }),
      }
    );
  } catch (err) {
    console.error("editMessage failed:", err);
  }
}
