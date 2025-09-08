import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = event.body || "";
  const params = new URLSearchParams(body);
  const token = params.get("token");
  const trainingSessionId = params.get("training_session_id");
  const athleteId = params.get("athlete_id");

  if (!token) {
    return { statusCode: 400, body: "Missing token" };
  }

  // Build redirect URL with parameters
  let redirectUrl = "/";
  const urlParams = new URLSearchParams();

  if (trainingSessionId) {
    urlParams.append("session", trainingSessionId);
  }
  if (athleteId) {
    urlParams.append("athlete", athleteId);
  }

  if (urlParams.toString()) {
    redirectUrl += "?" + urlParams.toString();
  }

  const cookie = [
    `apex_jwt=${encodeURIComponent(token)}`,
    "Path=/",
    "Domain=jamescpl.netlify.app",
    "SameSite=Lax",
    "Secure",
    "Max-Age=7200"
  ].join("; ");

  return {
    statusCode: 302,
    headers: {
      "Set-Cookie": cookie,
      "Location": redirectUrl
    }
  };
};
