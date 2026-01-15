export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Dental GPSC 2.0 is running ✅", { status: 200 });
    }

    let update;
    try {
      update = await request.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (!update.message || !update.message.text) {
      return new Response("OK", { status: 200 });
    }

    const chatId = update.message.chat.id;
    const text = update.message.text.trim();

    // /start command
    if (text === "/start") {
      await sendMessage(env.BOT_TOKEN, chatId,
        "👋 Welcome to *Dental GPSC 2.0*\n\nBot is live and ready 🚀",
        true
      );
    }

    return new Response("OK", { status: 200 });
  }
};

async function sendMessage(token, chatId, text, markdown = false) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: text
  };

  if (markdown) {
    payload.parse_mode = "Markdown";
  }

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
