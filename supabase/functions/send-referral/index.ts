import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { inviterName, inviterEmail, inviteeEmail, refLink } = await req.json();

    if (!inviteeEmail) {
      return new Response(JSON.stringify({ error: "Missing invitee email" }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#3699FF;padding:32px 32px 24px;text-align:center;">
            <img src="https://spedsummit.com/logo.png" alt="SPED Summit" height="40" style="height:40px;" onerror="this.style.display='none'"/>
            <div style="color:#fff;font-size:22px;font-weight:800;margin-top:12px;">You've been invited!</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
              <strong>${inviterName || "A colleague"}</strong> has invited you to join <strong>SPED Summit</strong> — a free professional development platform for special education teachers.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
              Get access to expert-led sessions, earn free PD certificates, and discover practical special education strategies.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${refLink}" style="display:inline-block;padding:14px 32px;background:#3699FF;color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                  Join SPED Summit Free →
                </a>
              </td></tr>
            </table>
            <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.5;">
              Or copy this link: <a href="${refLink}" style="color:#3699FF;">${refLink}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 24px;text-align:center;border-top:1px solid #F3F4F6;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;">
              © SPED Summit · You're receiving this because ${inviterName || "someone"} invited you.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "SPED Summit <noreply@spedsummit.com>",
        to: [inviteeEmail],
        subject: `${inviterName || "A colleague"} invited you to SPED Summit`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send email");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
