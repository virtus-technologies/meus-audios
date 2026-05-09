import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

import { siteUrl } from "@/lib/site";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = siteUrl();
const SITE_NAME = "MeusÁudios";
const SITE_TITLE = "MeusÁudios — Seus áudios organizados, transcritos e inteligentes";
const SITE_DESCRIPTION =
  "Faça upload de áudios, organize em pastas, transcreva automaticamente com Whisper e use IA para gerar resumos, análises e insights — tudo num só lugar.";
const SITE_KEYWORDS = [
  "transcrição de áudio",
  "transcrever áudio online",
  "transcrição automática",
  "WhatsApp áudio para texto",
  "transcrição de reunião",
  "resumo de áudio com IA",
  "biblioteca de áudios",
  "organizador de áudios",
  "análise de transcrição",
  "Whisper transcrição",
  "ata de reunião automática",
  "transcrição de aula",
  "transcrição de pregação",
  "MeusÁudios",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · MeusÁudios",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: SITE_KEYWORDS,
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    languages: { "pt-BR": "/" },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description:
      "Upload, organização em pastas, transcrição automática com Whisper e análises com IA.",
    url: "/",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "Upload, organização em pastas, transcrição automática com Whisper e análises com IA.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "productivity",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EA580C" },
    { media: "(prefers-color-scheme: dark)", color: "#9A3412" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/mark.svg`,
        width: 1024,
        height: 1024,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      inLanguage: "pt-BR",
      browserRequirements: "Requires JavaScript and a modern browser.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Upload de áudios até 2 GB (mp3, m4a, wav, ogg, mp4)",
        "Organização em pastas e tags",
        "Transcrição automática com Whisper",
        "Análises e resumos com IA",
        "Templates de prompts (reunião, aula, pregação, WhatsApp)",
        "Busca em texto completo na transcrição",
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
