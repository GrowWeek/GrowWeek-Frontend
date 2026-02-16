import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "GrowWeek - 주간 할일 & 회고 관리";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f5f5f4 0%, #ecfccb 50%, #d9f99d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#a3e635",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            🌱
          </div>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#1c1917",
              letterSpacing: "-2px",
            }}
          >
            GrowWeek
          </span>
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#57534e",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          매주 할일을 관리하고
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#57534e",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          회고를 통해 성장하세요
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "48px",
          }}
        >
          <div
            style={{
              background: "#a3e635",
              borderRadius: "12px",
              padding: "12px 28px",
              fontSize: "22px",
              fontWeight: 600,
              color: "#1c1917",
            }}
          >
            📋 할일 관리
          </div>
          <div
            style={{
              background: "#a3e635",
              borderRadius: "12px",
              padding: "12px 28px",
              fontSize: "22px",
              fontWeight: 600,
              color: "#1c1917",
            }}
          >
            📝 주간 회고
          </div>
          <div
            style={{
              background: "#a3e635",
              borderRadius: "12px",
              padding: "12px 28px",
              fontSize: "22px",
              fontWeight: 600,
              color: "#1c1917",
            }}
          >
            📊 성장 트래킹
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
