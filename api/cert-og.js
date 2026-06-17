import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler(request) {
  const { searchParams } = new URL(request.url);
  const name     = searchParams.get("name")     || "A Special Educator";
  const title    = searchParams.get("title")    || "SPED Summit Session";
  const date     = searchParams.get("date")     || "";
  const duration = searchParams.get("duration") || "";

  return new ImageResponse(
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
          background: "linear-gradient(135deg, #f8f6ff 0%, #eef3fd 50%, #f0fdf4 100%)",
          fontFamily: "'Arial', sans-serif",
          padding: "60px 80px",
          position: "relative",
        },
        children: [
          // Top accent bar
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 8,
                background: "linear-gradient(90deg, #6490E8, #a78bfa, #34d399)",
              },
            },
          },
          // Logo / brand
          {
            type: "div",
            props: {
              style: {
                fontSize: 18,
                fontWeight: 700,
                color: "#6490E8",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 24,
              },
              children: "SPED SUMMIT",
            },
          },
          // "Certificate of Professional Development" label
          {
            type: "div",
            props: {
              style: {
                fontSize: 22,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 8,
              },
              children: "Certificate of Professional Development",
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: 16,
                color: "#9ca3af",
                marginBottom: 32,
              },
              children: "is presented to",
            },
          },
          // Recipient name
          {
            type: "div",
            props: {
              style: {
                fontSize: name.length > 20 ? 54 : 68,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: -2,
                lineHeight: 1.1,
                textAlign: "center",
                marginBottom: 32,
              },
              children: name,
            },
          },
          // Divider
          {
            type: "div",
            props: {
              style: {
                width: 120,
                height: 3,
                background: "linear-gradient(90deg, #6490E8, #a78bfa)",
                borderRadius: 2,
                marginBottom: 32,
              },
            },
          },
          // Session title
          {
            type: "div",
            props: {
              style: {
                fontSize: title.length > 50 ? 22 : 26,
                fontWeight: 600,
                color: "#1e3a5f",
                textAlign: "center",
                maxWidth: 900,
                lineHeight: 1.4,
                marginBottom: 28,
              },
              children: title,
            },
          },
          // Meta row: duration + date
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                gap: 32,
                alignItems: "center",
                fontSize: 16,
                color: "#6b7280",
                fontWeight: 500,
              },
              children: [
                duration ? { type: "span", props: { children: `⏱ ${duration}` } } : null,
                date     ? { type: "span", props: { children: `📅 ${date}` } } : null,
              ].filter(Boolean),
            },
          },
          // Bottom accent
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: 24,
                fontSize: 14,
                color: "#9ca3af",
                letterSpacing: 1,
              },
              children: "spedsummit.com",
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}
