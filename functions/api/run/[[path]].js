// Gugu Run API relay: forwards /api/run/* to the Hong Kong backend.
// The game client only uses this path when the direct connection
// fails at the network level (e.g. the player's network blocks the
// route to Hong Kong). Passes the real client IP via
// x-forwarded-for so backend per-IP rate limits stay accurate.
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const target = "https://api.cino1018.com" + url.pathname + url.search;
  const headers = new Headers(request.headers);
  headers.delete("host");
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) headers.set("x-forwarded-for", ip);
  const init = { method: request.method, headers, redirect: "manual" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }
  const resp = await fetch(target, init);
  return new Response(resp.body, { status: resp.status, headers: resp.headers });
}
