export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const response = await context.next();
  const url = new URL(request.url);

  // Force CSS files to have correct MIME type
  if (url.pathname.endsWith(".css")) {
    const headers = new Headers(response.headers);
    headers.set("Content-Type", "text/css; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=31536000");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Force JS files to have correct MIME type
  if (url.pathname.endsWith(".js") || url.pathname.endsWith(".mjs")) {
    const headers = new Headers(response.headers);
    headers.set("Content-Type", "application/javascript; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=31536000");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
};
