import { hashString } from "./hash";

const PRESETS = ["classic", "compact", "hero", "split"];

export function useStatVisual(stat) {
  const key = `${stat.series}:${stat.aggregate}`;
  const hash = hashString(key);

  // layout preset
  const preset = PRESETS[hash % PRESETS.length];

  // semantic variant
  let variant = "neutral";
  if (stat.value < 0) variant = "danger";
  else if (stat.value > 0 && stat.type?.includes("SIGNED")) variant = "success";

  // micro-variation
  const stripPosition = hash % 3; // left / top / bottom

  return { preset, variant, stripPosition };
}
