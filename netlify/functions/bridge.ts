function readCookie(name: string) {
  const entry = document.cookie.split("; ").find(r => r.startsWith(name + "="));
  return entry ? decodeURIComponent(entry.split("=")[1]) : null;
}

async function getJwt() {
  const token = readCookie("apex_jwt");
  if (token) {
    // Optional: clear it now that we’ve read it
    document.cookie = "apex_jwt=; Path=/; Max-Age=0; SameSite=Lax; Secure";
    return token;
  }
  // No token? Send user to APEX bridge to authenticate and bounce back
  window.location.href = "https://<your-apex-host>/ords/r/<your-app-alias>/bridge";
  return null;
}

(async () => {
  const jwt = await getJwt();
  if (!jwt) return;

  // Example ORDS call
  const res = await fetch("https://<your-ords-host>/ords/<schema>/ext/data/planned-exercises", {
    headers: { Authorization: `Bearer ${jwt}` }
  });

  if (res.status === 401) {
    // expired → go mint a fresh one
    window.location.href = "https://<your-apex-host>/ords/r/<your-app-alias>/bridge";
    return;
  }

  const data = await res.json();
  console.log("Data:", data);
  // render your UI...
})();
