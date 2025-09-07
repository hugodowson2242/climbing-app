import type { Handler } from "@netlify/functions";

// Accept form POST from APEX (token in body), set short-lived cookie, redirect to SPA
export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // event.body is x-www-form-urlencoded by default for APEX form posts
  const body = event.body || "";
  const params = new URLSearchParams(body);
  const token = params.get("token");

  if (!token) {
    return { statusCode: 400, body: "Missing token" };
  }

  // Set a short-lived cookie (10 minutes).
  // NOTE: Not HttpOnly so the SPA can read it once in JS, then you can clear it.
  // In production you can also do an exchange function to keep HttpOnly if you prefer.
  const cookie = [
    `apex_jwt=${encodeURIComponent(token)}`,
    "Path=/",
    "SameSite=Lax",
    "Secure",          // Netlify is HTTPS, keep this
    "Max-Age=600"      // 10 minutes
  ].join("; ");

  return {
    statusCode: 302,
    headers: {
      "Set-Cookie": cookie,
      "Location": "/"
    }
  };
};
