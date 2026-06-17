import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler(request) {
  const { searchParams, origin } = new URL(request.url);
  const name     = searchParams.get("name")     || "A Special Educator";
  const title    = searchParams.get("title")    || "SPED Summit Session";
  const date     = searchParams.get("date")     || "";
  const duration = searchParams.get("duration") || "60 mins";

  const bgUrl = `${origin}/cert-bg.jpg`;

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
          padding: "20px",
        },
        children: [
          // Certificate card — matches the actual downloaded certificate
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
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                padding: "36px 56px 28px",
              },
              children: [
                // Stars
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      gap: 8,
                      marginBottom: 16,
                    },
                    children: ["★", "★", "★"].map((s, i) => ({
                      type: "span",
                      props: {
                        key: i,
                        style: { fontSize: 28, color: "#4A90D9" },
                        children: s,
                      },
                    })),
                  },
                },
                // Title
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#1a1a1a",
                      textAlign: "center",
                      letterSpacing: "-0.3px",
                      marginBottom: 6,
                      fontFamily: "Arial, sans-serif",
                    },
                    children: "Certificate of Professional Development Hours",
                  },
                },
                // "is presented to"
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 14,
                      color: "#6b7280",
                      marginBottom: 10,
                      fontFamily: "Arial, sans-serif",
                    },
                    children: "is presented to",
                  },
                },
                // Recipient name
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: name.length > 22 ? 46 : 60,
                      fontWeight: 900,
                      color: "#111827",
                      letterSpacing: -2,
                      lineHeight: 1,
                      textAlign: "center",
                      marginBottom: 18,
                      fontFamily: "Arial, sans-serif",
                    },
                    children: name,
                  },
                },
                // Thin divider
                {
                  type: "div",
                  props: {
                    style: {
                      width: 500,
                      height: 1,
                      background: "#d1d5db",
                      marginBottom: 14,
                    },
                  },
                },
                // "For their participation…"
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 12,
                      color: "#6b7280",
                      marginBottom: 6,
                      fontFamily: "Arial, sans-serif",
                    },
                    children: "For their participation in the session titled:",
                  },
                },
                // Session title
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: title.length > 60 ? 16 : 20,
                      fontWeight: 700,
                      color: "#1a1a1a",
                      lineHeight: 1.35,
                      textAlign: "center",
                      marginBottom: 16,
                      fontFamily: "Arial, sans-serif",
                      maxWidth: 880,
                    },
                    children: title,
                  },
                },
                // Duration + Date row (bordered)
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "10px 0",
                      borderTop: "1px solid #e5e7eb",
                      borderBottom: "1px solid #e5e7eb",
                      marginBottom: 10,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 14, fontWeight: 700, color: "#1a1a1a", fontFamily: "Arial, sans-serif" },
                          children: `Session time: ${duration}`,
                        },
                      },
                      date
                        ? {
                            type: "div",
                            props: {
                              style: { fontSize: 14, fontWeight: 700, color: "#1a1a1a", fontFamily: "Arial, sans-serif" },
                              children: date,
                            },
                          }
                        : { type: "span", props: { children: "" } },
                    ],
                  },
                },
                // Footer verify
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 11,
                      color: "#6490E8",
                      fontWeight: 600,
                      fontFamily: "Arial, sans-serif",
                      marginTop: 4,
                    },
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
