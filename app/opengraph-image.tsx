import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TheBoxMakers premium carton packaging solutions in India";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #173d2c 0%, #385f47 55%, #f5f0e5 100%)",
          color: "white",
          padding: "56px",
          justifyContent: "space-between",
          alignItems: "stretch",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "72%" }}>
          <div style={{ fontSize: 24, letterSpacing: 10, textTransform: "uppercase", opacity: 0.72 }}>
            TheBoxMakers
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>Premium Carton Packaging Solutions in India</div>
            <div style={{ fontSize: 28, lineHeight: 1.4, opacity: 0.9 }}>
              Corrugated boxes, custom packaging, and eco friendly packaging material for ambitious Indian brands.
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#f6d6a8" }}>Call +91 8920894998</div>
        </div>
        <div
          style={{
            width: 220,
            borderRadius: 32,
            border: "1px solid rgba(255,255,255,0.28)",
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
          }}
        >
          Eco Packaging
        </div>
      </div>
    ),
    size,
  );
}

