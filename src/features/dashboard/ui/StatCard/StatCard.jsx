import { useStatVisual } from "./useStatVisual";
import { VARIANTS } from "./variants";

import Classic from "./presets/Classic";
import Compact from "./presets/Compact";
import Hero from "./presets/Hero";
import Split from "./presets/Split";

const PRESET_COMPONENT = {
  classic: Classic,
  compact: Compact,
  hero: Hero,
  split: Split,
};

export default function StatCard({ stat }) {
  const ui = useStatVisual(stat);
  const styles = VARIANTS[ui.variant];
  const Component = PRESET_COMPONENT[ui.preset] ?? Classic;

  return <Component stat={stat} styles={styles} />;
}
