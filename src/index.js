import { routeUpdate } from "./bot/router.js";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    let update;
    try {
      update = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 200 });
    }

    try {
      await routeUpdate(update, env);
    } catch (err) {
      console.error("Router error:", err);
    }

    return new Response("OK", { status: 200 });
  },
};
