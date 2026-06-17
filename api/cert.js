const SUPABASE_URL = "https://eziioterdhlaqatrnubx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aWlvdGVyZGhsYXFhdHJudWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDI4MzUsImV4cCI6MjA5MjQxODgzNX0._HlB63GHE739SdAzdGt0jnOiU1gNoKRf9GivMr-Fax8";

export default async function handler(req, res) {
  const { cert_id } = req.query;
  const origin = `https://${req.headers.host}`;
  const appUrl = `${origin}/?cert_id=${cert_id}`;
  const canonicalUrl = `${origin}/cert?cert_id=${cert_id}`;

  if (!cert_id) {
    res.writeHead(302, { Location: origin });
    res.end();
    return;
  }

  // Fetch cert data from Supabase
  let certData = null;
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/certificates?id=eq.${encodeURIComponent(cert_id)}&select=cert_data`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const rows = await r.json();
    if (rows?.[0]?.cert_data) certData = rows[0].cert_data;
  } catch (_) {}

  const name     = certData?.recipientName || "A Special Educator";
  const title    = certData?.sessionTitle  || "SPED Summit Session";
  const date     = certData?.date          || "";
  const duration = certData?.duration      || "";

  const ogTitle = `${name} earned a certificate – ${title}`;
  const ogDesc  = `${name} successfully completed "${title}"${duration ? ` (${duration})` : ""}${date ? ` on ${date}` : ""} at SPED Summit — a professional development program for special educators.`;
  const ogImageParams = new URLSearchParams({ name, title, date, duration, v: "3" }).toString();
  const ogImage = `${origin}/cert-og?${ogImageParams}`;

  // Escape any quotes in dynamic content to prevent HTML injection
  const safe = (s) => String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${safe(ogTitle)}</title>

  <!-- Open Graph (LinkedIn, Facebook, WhatsApp, Slack) -->
  <meta property="og:type"         content="website"/>
  <meta property="og:url"          content="${canonicalUrl}"/>
  <meta property="og:title"        content="${safe(ogTitle)}"/>
  <meta property="og:description"  content="${safe(ogDesc)}"/>
  <meta property="og:image"             content="${ogImage}"/>
  <meta property="og:image:secure_url"  content="${ogImage}"/>
  <meta property="og:image:type"        content="image/png"/>
  <meta property="og:image:width"       content="1200"/>
  <meta property="og:image:height"      content="630"/>
  <meta property="og:site_name"         content="SPED Summit"/>

  <!-- Twitter / X Card -->
  <meta name="twitter:card"        content="summary_large_image"/>
  <meta name="twitter:title"       content="${safe(ogTitle)}"/>
  <meta name="twitter:description" content="${safe(ogDesc)}"/>
  <meta name="twitter:image"       content="${ogImage}"/>

  <meta name="description" content="${safe(ogDesc)}"/>

  <!-- Redirect real users to the app (JS only — meta-refresh would cause crawlers to follow and miss OG tags) -->
  <script>window.location.replace("${appUrl}");</script>
</head>
<body>
  <p>Redirecting to certificate… <a href="${appUrl}">Click here</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(html);
}
