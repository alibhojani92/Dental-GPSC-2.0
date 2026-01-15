export default {
  async fetch(request, env) {
    return new Response(
      "Dental GPSC 2.0 is live ✅",
      { status: 200 }
    );
  }
};
