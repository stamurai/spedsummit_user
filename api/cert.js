const SUPABASE_URL = "https://eziioterdhlaqatrnubx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aWlvdGVyZGhsYXFhdHJudWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDI4MzUsImV4cCI6MjA5MjQxODgzNX0._HlB63GHE739SdAzdGt0jnOiU1gNoKRf9GivMr-Fax8";

export default async function handler(req, res) {
  const { cert_id } = req.query;
  const origin = `https://${req.headers.host}`;
  const appUrl = `${origin}/?cert_id=${cert_id}`;

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

  const name    = certData?.recipientName  || "A Special Educator";
  const title   = certData?.sessionTitle   || "SPED Summit Session";
  const date    = certData?.date           || "";
  const duration = certData?.duration      || "";

  const ogTitle = `${name} earned a certificate – ${title}`;
  const ogDesc  = `${name} successfully completed "${title}"${duration ? ` (${duration})` : ""}${date ? ` on ${date}` : ""} at SPED Summit — a professional development program for special educators.`;
  const ogImage = `${origin}/Certificate%20Background.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${ogTitle}</title>

  <!-- Open Graph -->
  <meta property="og:type"        content="website"/>
  <meta property="og:url"         content="${appUrl}"/>
  <meta property="og:title"       content="${ogTitle}"/>
  <meta property="og:description" content="${ogDesc}"/>
  <meta property="og:image"       content="${ogImage}"/>
  <meta property="og:image:width"  content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:site_name"   content="SPED Summit"/>

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image"/>
  <meta name="twitter:title"       content="${ogTitle}"/>
  <meta name="twitter:description" content="${ogDesc}"/>
  <meta name="twitter:image"       content="${ogImage}"/>

  <!-- LinkedIn / WhatsApp fallback -->
  <meta name="description" content="${ogDesc}"/>

  <!-- Redirect real users instantly -->
  <meta http-equiv="refresh" content="0; url=${appUrl}"/>
  <script>window.location.replace("${appUrl}");</script>
</head>
<body>
  <p>Redirecting to certificate… <a href="${appUrl}">Click here</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).send(html);
}
