import { FILTER_OPERATION_MAP } from "./filters";

const parseColor = (color) => {
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
};

const shadeColor = (color, percent) => {
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

const rgbaToHex = (rgba) => {
  const [r, g, b, a = 1] = rgba
    .replace(/rgba?|\(|\)|\s/g, "")
    .split(",")
    .map(Number);

  const toHex = (n) => n.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${
    a < 1 ? toHex(Math.round(a * 255)) : ""
  }`;
};

const hexToRgba = (hex) => {
  let h = hex.replace("#", "").trim();

  // #RGB
  if (h.length === 3) {
    h =
      h
        .split("")
        .map((c) => c + c)
        .join("") + "ff";
  }

  // #RRGGBB
  if (h.length === 6) {
    h += "ff";
  }

  // #RRGGBBAA
  if (h.length !== 8) return null;

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = parseInt(h.slice(6, 8), 16) / 255;

  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
};

const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
};

const parseHsl = (color) => {
  const m = color.match(
    /hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%\s*(?:[\/,]\s*([\d.]+))?\s*\)/,
  );

  if (!m) return null;

  const h = Number(m[1]);
  const s = Number(m[2]);
  const l = Number(m[3]);
  const a = m[4] !== undefined ? Number(m[4]) : 1;

  const { r, g, b } = hslToRgb(h, s, l);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const resolveCssColor = (color) => {
  if (!color) return "rgba(0,0,0,1)";

  /* already safe */
  if (color.startsWith("rgba") || color.startsWith("rgb")) {
    return color;
  }

  /* hex */
  if (color.startsWith("#")) {
    return hexToRgba(color) ?? "rgba(0,0,0,1)";
  }

  /* CSS variable */
  if (color.startsWith("var(")) {
    const varName = color.slice(4, -1).trim();
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();

    if (!raw) return "rgba(0,0,0,1)";
    return resolveCssColor(raw); // recurse
  }

  /* hsl / hsla */
  if (color.startsWith("hsl")) {
    return parseHsl(color) ?? "rgba(0,0,0,1)";
  }

  /* named colors */
  return color;
};

const evaluateColorRules = (value, rules = []) => {
  if (rules.length > 0 && rules[0]?.operator === "always") {
    return rules[0];
  }

  const sorted = [...rules].sort((a, b) => {
    // numeric rules → higher value first
    if (a.operator === "greaterThan" && b.operator === "greaterThan") {
      return b.value - a.value;
    }
    return 0;
  });

  for (const rule of sorted) {
    const fn = FILTER_OPERATION_MAP[rule.operator];
    if (!fn) continue;

    if (fn(value, rule.value ?? rule.from, rule?.to)) {
      return rule;
    }
  }

  return { color: "var(--info)", label: "Default" };
};

export {
  parseColor,
  shadeColor,
  rgbaToHex,
  hexToRgba,
  hslToRgb,
  parseHsl,
  resolveCssColor,
  evaluateColorRules,
};
