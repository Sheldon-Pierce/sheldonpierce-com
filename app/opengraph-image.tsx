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
          background: "#07090c",
          color: "#ede8df",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 24, color: "#8e9aa3" }}>
          sheldonpierce.com · core sample №01
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
          Sheldon Pierce<span style={{ color: "#c9824b" }}>.</span>
        </div>
        <div style={{ fontSize: 28, color: "#8fc1c7" }}>
          Software engineer · Seattle
        </div>
      </div>
    ),
    size,
  );
}
