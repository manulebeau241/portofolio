import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Okoumia — Import Gabon",
    short_name: "Okoumia",
    description:
      "Mode, accessoires, électronique et cosmétique importés, à retirer dans un point relais près de chez vous à Libreville.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#0c2c20",
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
