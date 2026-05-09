import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MeusÁudios",
    short_name: "MeusÁudios",
    description: "Seus áudios organizados, transcritos e inteligentes.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#EA580C",
    orientation: "portrait",
    lang: "pt-BR",
    dir: "ltr",
    categories: ["productivity", "utilities", "business"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
