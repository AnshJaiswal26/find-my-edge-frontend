export const parseColor = (color) => {
  const val = color.includes("--")
    ? getComputedStyle(document.documentElement).getPropertyValue(
        color.substring(4, color.length - 1)
      )
    : color;
  return val;
};
