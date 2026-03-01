export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Example: basic routing
    if (url.pathname === '/api/health') {
      return Response.json({ status: 'ok' });
    }

    // Default response
    return new Response('Not Found', { status: 404 });
  },
};
