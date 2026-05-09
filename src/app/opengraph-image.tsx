import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "MeusÁudios — Seus áudios organizados, transcritos e inteligentes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [fraunces, frauncesItalic, jakarta, markSvg] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Fraunces-500.woff")),
    readFile(join(process.cwd(), "public/fonts/Fraunces-600-Italic.woff")),
    readFile(join(process.cwd(), "public/fonts/PlusJakartaSans-500.woff")),
    readFile(join(process.cwd(), "public/brand/mark.svg"), "utf-8"),
  ]);
  const markUri = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        padding: "72px 80px",
        position: "relative",
        fontFamily: "Jakarta",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 640,
          height: 640,
          background: "radial-gradient(circle, rgba(234, 88, 12, 0.22) 0%, transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -160,
          left: -120,
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(225, 29, 72, 0.18) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          marginBottom: 56,
        }}
      >
        <img src={markUri} width={104} height={104} alt="" />
        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces",
            fontWeight: 500,
            fontSize: 56,
            color: "#0F172A",
            letterSpacing: -2,
            alignItems: "baseline",
          }}
        >
          <span>Meus</span>
          <span
            style={{
              fontFamily: "FrauncesItalic",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#EA580C",
            }}
          >
            Áudios
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            fontFamily: "Fraunces",
            fontWeight: 500,
            fontSize: 76,
            color: "#0F172A",
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          Seus áudios organizados,
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces",
            fontWeight: 500,
            fontSize: 76,
            letterSpacing: -3,
            lineHeight: 1.05,
            color: "#0F172A",
          }}
        >
          <span
            style={{
              fontFamily: "FrauncesItalic",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#EA580C",
            }}
          >
            transcritos
          </span>
          <span>&nbsp;e inteligentes.</span>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: "Jakarta",
            fontSize: 26,
            color: "#475569",
            lineHeight: 1.4,
            maxWidth: 920,
          }}
        >
          Upload, organização em pastas, transcrição automática com Whisper e análises com IA — tudo
          num só lugar.
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            fontFamily: "Jakarta",
            fontSize: 18,
            color: "#94A3B8",
            fontWeight: 500,
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          <span>WhatsApp</span>
          <span>·</span>
          <span>Reuniões</span>
          <span>·</span>
          <span>Aulas</span>
          <span>·</span>
          <span>Pregações</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 500 },
        { name: "FrauncesItalic", data: frauncesItalic, style: "italic", weight: 600 },
        { name: "Jakarta", data: jakarta, style: "normal", weight: 500 },
      ],
    },
  );
}
