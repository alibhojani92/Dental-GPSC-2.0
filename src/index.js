import { routeUpdate } from "./bot/router.js";

export default {
  async fetch(request, env, ctx) {
    // Telegram ONLY sends POST
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    try {
      const update = await request.json();

      // 🔥 DO NOT await directly (prevents crash propagation)
      ctx.waitUntil(routeUpdate(update, env));
    } catch (err) {
      console.error("WEBHOOK ERROR:", err);
    }

    // ✅ Telegram MUST get 200 NO MATTER WHAT
    return new Response("OK", { status: 200 });
  },
};
