import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(request) {
  const { searchParams, origin } = new URL(request.url);
  const name     = searchParams.get("name")     || "A Special Educator";
  const title    = searchParams.get("title")    || "SPED Summit Session";
  const date     = searchParams.get("date")     || "";
  const duration = searchParams.get("duration") || "60 mins";

  // Fetch background image and convert to data URL so Satori can render it
  // Use chunked approach to avoid spread-operator stack limit on large files
  let bgDataUrl = null;
  try {
    const res = await fetch(`${origin}/cert-bg.jpg`);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      bgDataUrl = `data:image/jpeg;base64,${btoa(binary)}`;
    }
  } catch (_) {}

  const bgStyle = bgDataUrl
    ? { backgroundImage: `url(${bgDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(135deg,#fdf6ec 0%,#f0fdf4 50%,#eef3fd 100%)" };

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f6f0",
          padding: "18px",
        },
        children: [
          // Certificate card
          {
            type: "div",
            props: {
              style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                overflow: "hidden",
                padding: "32px 52px 24px",
                ...bgStyle,
              },
              children: [
                // Title
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#1a1a1a",
                      textAlign: "center",
                      marginBottom: 5,
                      fontFamily: "Arial, sans-serif",
                    },
                    children: "Certificate of Professional Development Hours",
                  },
                },
                // "is presented to"
                {
                  type: "div",
                  props: {
                    style: { fontSize: 13, color: "#6b7280", marginBottom: 8, fontFamily: "Arial, sans-serif" },
                    children: "is presented to",
                  },
                },
                // Recipient name
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: name.length > 24 ? 42 : 58,
                      fontWeight: 900,
                      color: "#111827",
                      letterSpacing: -1.5,
                      lineHeight: 1,
                      textAlign: "center",
                      marginBottom: 16,
                      fontFamily: "Arial, sans-serif",
                    },
                    children: name,
                  },
                },
                // Divider
                {
                  type: "div",
                  props: {
                    style: { width: 480, height: 1, background: "#d1d5db", marginBottom: 12 },
                  },
                },
                // "For their participation…"
                {
                  type: "div",
                  props: {
                    style: { fontSize: 11, color: "#6b7280", marginBottom: 5, fontFamily: "Arial, sans-serif" },
                    children: "For their participation in the session titled:",
                  },
                },
                // Session title
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: title.length > 65 ? 15 : 19,
                      fontWeight: 700,
                      color: "#1a1a1a",
                      lineHeight: 1.35,
                      textAlign: "center",
                      marginBottom: 14,
                      fontFamily: "Arial, sans-serif",
                      maxWidth: 860,
                    },
                    children: title,
                  },
                },
                // Duration + Date row
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "9px 0",
                      borderTop: "1px solid #e5e7eb",
                      borderBottom: "1px solid #e5e7eb",
                      marginBottom: 10,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 13, fontWeight: 700, color: "#1a1a1a", fontFamily: "Arial, sans-serif" },
                          children: `Session time: ${duration}`,
                        },
                      },
                      date
                        ? {
                            type: "div",
                            props: {
                              style: { fontSize: 13, fontWeight: 700, color: "#1a1a1a", fontFamily: "Arial, sans-serif" },
                              children: date,
                            },
                          }
                        : { type: "span", props: { children: "" } },
                    ],
                  },
                },
                // Verify footer
                {
                  type: "div",
                  props: {
                    style: { fontSize: 11, color: "#6490E8", fontWeight: 600, fontFamily: "Arial, sans-serif" },
                    children: "spedsummit.com",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}
