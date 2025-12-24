export function parseColor(color) {
  if (!color) return "#000000";

  // 1️⃣ Resolve CSS variables
  let resolved = color;

  if (color.startsWith("var(")) {
    const varName = color.slice(4, -1);
    resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  // 2️⃣ Let the browser parse the color
  const ctx = document.createElement("canvas").getContext("2d");

  // Invalid colors throw → catch fallback
  try {
    ctx.fillStyle = resolved;
  } catch {
    return "#000000";
  }

  // 3️⃣ Browser converts everything → rgb(r, g, b)
  const rgb = ctx.fillStyle;

  // 4️⃣ Convert rgb(...) → hex
  if (rgb.startsWith("rgb")) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);

    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  // Already hex
  return rgb;
}

export const shadeColor = (color, percent) => {
  let num = parseInt(color.replace("#", ""), 16);
  let amt = Math.round(2.55 * percent);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0x00ff) + amt;
  let b = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (r < 255 ? (r < 0 ? 0 : r) : 255) * 0x10000 +
    (g < 255 ? (g < 0 ? 0 : g) : 255) * 0x100 +
    (b < 255 ? (b < 0 ? 0 : b) : 255)
  )
    .toString(16)
    .slice(1)}`;
};
