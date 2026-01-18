import { routeUpdate } from "./bot/router.js";

export default {
  async fetch(request, env) {
    try {
      if (request.method !== "POST") {
        return new Response("OK", { status: 200 });
      }

      const update = await request.json();
      await routeUpdate(update, env);

      // ✅ ALWAYS respond 200 to Telegram
      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error("WEBHOOK ERROR:", err);

      // ⚠️ Even on error, Telegram must get 200
      return new Response("OK", { status: 200 });
    }
  },
};
