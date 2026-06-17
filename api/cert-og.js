import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler(request) {
  const { searchParams, origin } = new URL(request.url);
  const name     = searchParams.get("name")     || "A Special Educator";
  const title    = searchParams.get("title")    || "SPED Summit Session";
  const date     = searchParams.get("date")     || "";
  const duration = searchParams.get("duration") || "1 Hour";

  // OG canvas: 1200×630
  // Certificate aspect ratio: 11×8.5 → at height 590 → width = 590*(11/8.5) ≈ 764
  const certW = 764;
  const certH = 590;
  const certLeft = (1200 - certW) / 2; // 218 — centered

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
          background: "linear-gradient(135deg, #eef3fd 0%, #f5f3ff 50%, #f0fdf4 100%)",
          position: "relative",
        },
        children: [
          // Certificate card
          {
            type: "div",
            props: {
              style: {
                position: "relative",
                width: certW,
                height: certH,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
              },
              children: [
                // Background image
                {
                  type: "img",
                  props: {
                    src: bgUrl,
                    style: {
                      position: "absolute",
                      top: 0, left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  },
                },
                // Content overlay
                {
                  type: "div",
                  props: {
                    style: {
                      position: "absolute",
                      top: 0, left: 0, right: 0, bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "28px 40px 20px",
                    },
                    children: [
                      // Title
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            textAlign: "center",
                            letterSpacing: "-0.3px",
                            marginBottom: 4,
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
                            fontSize: 11,
                            fontWeight: 400,
                            color: "#6b7280",
                            marginBottom: 8,
                            letterSpacing: "0.4px",
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
                            fontSize: name.length > 22 ? 34 : 42,
                            fontWeight: 800,
                            color: "#111827",
                            letterSpacing: -1.5,
                            lineHeight: 1,
                            textAlign: "center",
                            marginBottom: 14,
                            fontFamily: "Arial, sans-serif",
                          },
                          children: name,
                        },
                      },
                      // Gradient divider
                      {
                        type: "div",
                        props: {
                          style: {
                            width: 400,
                            height: 1,
                            background: "linear-gradient(90deg, transparent, #d1d5db, transparent)",
                            marginBottom: 14,
                          },
                        },
                      },
                      // "For their participation..."
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 10,
                            fontWeight: 400,
                            color: "#6b7280",
                            marginBottom: 5,
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
                            fontSize: title.length > 50 ? 14 : 17,
                            fontWeight: 600,
                            color: "#1a1a1a",
                            lineHeight: 1.3,
                            textAlign: "center",
                            marginBottom: 14,
                            fontFamily: "Arial, sans-serif",
                            maxWidth: 640,
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
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 40,
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
                                style: { fontSize: 12, fontWeight: 600, color: "#1a1a1a", fontFamily: "Arial, sans-serif" },
                                children: `Session time: ${duration}`,
                              },
                            },
                            date
                              ? {
                                  type: "div",
                                  props: {
                                    style: { fontSize: 12, fontWeight: 600, color: "#1a1a1a", fontFamily: "Arial, sans-serif" },
                                    children: date,
                                  },
                                }
                              : null,
                          ].filter(Boolean),
                        },
                      },
                      // Bottom verify line
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 10,
                            color: "#6490E8",
                            fontWeight: 600,
                            fontFamily: "Arial, sans-serif",
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
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}
