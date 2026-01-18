if (update.callback_query) {
  const cb = update.callback_query;
  const chatId = cb.message.chat.id;
  const messageId = cb.message.message_id;
  const userId = cb.from.id;
  const data = cb.data;

  // 🔴 TEMP DEBUG – REMOVE AFTER CONFIRM
  await sendMessage(
    chatId,
    `DEBUG CALLBACK RECEIVED:\n${data}`,
    env
  );

  // 🔥 ANSWERS FIRST
  if (data.startsWith("ANS_")) {
    const answer = data.replace("ANS_", "");
    return answerHandler(chatId, userId, answer, env);
  }

  ...
}
