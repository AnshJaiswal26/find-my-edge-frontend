import { Section } from "@shared/components/layout";
import { ColorPicker, Input } from "@shared/components/ui";

export default function TrackSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Track">
      <div className="space-y-4">
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
          onCommit={(c) =>
            setLayoutDraft((p) => ({ ...p, trackBackground: c }))
          }
        />
      </div>
    </Section>
  );
}
