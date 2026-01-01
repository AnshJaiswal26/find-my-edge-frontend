import { Section } from "@layout";
import { ColorPicker, Input } from "@ui";

export default function TrackSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Track">
      <Input
        label="Track Width"
        type="range"
        value={layoutDraft.strokeWidth}
        formatter={(v) => `${v}%`}
        min={0}
        max={100}
        onCommit={(v) =>
          setLayoutDraft((p) => ({ ...p, strokeWidth: Number(v) }))
        }
      />

      <ColorPicker
        label="Background"
        value={layoutDraft.trackBackground}
        onCommit={(c) => setLayoutDraft((p) => ({ ...p, trackBackground: c }))}
      />
    </Section>
  );
}
