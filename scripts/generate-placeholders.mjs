import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
mkdirSync(outDir, { recursive: true });

const palette = [
  ["#0B3D2E", "#D7A94B"],
  ["#123C2E", "#C98C3C"],
  ["#0E4636", "#E0B65C"],
  ["#163B2C", "#B98A3E"],
];

const items = [
  ["electromenager", "Électroménager"],
  ["tech", "Tech"],
  ["accessoires", "Accessoires"],
  ["meubles", "Meubles"],
];

items.forEach(([seed], i) => {
  const [bg, accent] = palette[i % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#04211A"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <circle cx="650" cy="150" r="180" fill="${accent}" opacity="0.12"/>
  <circle cx="120" cy="700" r="220" fill="${accent}" opacity="0.10"/>
  <rect x="60" y="710" width="48" height="5" fill="${accent}"/>
  <text x="60" y="694" fill="${accent}" font-family="Arial, sans-serif" font-size="18" letter-spacing="3" opacity="0.85">
    OKOUMIA
  </text>
</svg>`;
  writeFileSync(path.join(outDir, `${seed}.svg`), svg, "utf8");
});

console.log(`Généré ${items.length} placeholders dans ${outDir}`);
