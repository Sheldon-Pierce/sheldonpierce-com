import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sheldon Pierce — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
          color: "#0a0a0b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.7 }}>sheldonpierce.com</div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
          Sheldon Pierce
        </div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>
          Software engineer · Seattle
        </div>
      </div>
    ),
    size,
  );
}
