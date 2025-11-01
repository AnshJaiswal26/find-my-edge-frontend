export const parseColor = (color) => {
  const val = color.includes("--")
    ? getComputedStyle(document.documentElement).getPropertyValue(
        color.substring(4, color.length - 1)
      )
    : color;
  return val;
};

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
