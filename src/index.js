export default {
  async fetch(request, env, ctx) {
    // Only accept POST requests from Telegram
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    let update;
    try {
      update = await request.json();
    } catch (err) {
      // Invalid JSON should not crash the worker
      return new Response("Invalid JSON", { status: 200 });
    }

    // Basic safety check
    if (!update || !update.message || !update.message.chat) {
      return new Response("No message", { status: 200 });
    }

    const chatId = update.message.chat.id;

    // Minimal Telegram sendMessage call
    const telegramApiUrl =
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const payload = {
      chat_id: chatId,
      text: "✅ GPSC Dental Bot is live.\nPhase-0 check passed.",
    };

    try {
      await fetch(telegramApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Even if Telegram fails, Worker must respond
      return new Response("Telegram send failed", { status: 200 });
    }

    // IMPORTANT: Always return a response
    return new Response("OK", { status: 200 });
  },
};
