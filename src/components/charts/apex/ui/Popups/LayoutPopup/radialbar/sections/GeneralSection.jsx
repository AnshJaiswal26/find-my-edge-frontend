import { Section } from "@layout";
import { Button, Input } from "@ui";

export default function RadialGeneralSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="General">
      <Input
        vertical
        label="Title"
        type="text"
        value={layoutDraft.title}
        placeholder="Chart title"
        onCommit={(v) => setLayoutDraft((p) => ({ ...p, title: v }))}
      />

      <Button.Toggle
        label="Tooltip"
        value={layoutDraft.tooltip}
        onChange={(v) => setLayoutDraft((p) => ({ ...p, tooltip: v }))}
      />

      <Input
        label="Hollow Size"
        type="range"
        value={layoutDraft.hollowSize}
        formatter={(v) => `${v}%`}
        min={30}
        max={80}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            hollowSize: Number(v),
          }))
        }
      />

      <Input
        label="Start Angle"
        type="range"
        value={layoutDraft.startAngle}
        min={-360}
        max={0}
        step={90}
        onCommit={(v) => {
          setLayoutDraft((p) => ({
            ...p,
            startAngle: Number(v),
          }));
        }}
      />

      <Input
        label="End Angle"
        type="range"
        value={layoutDraft.endAngle}
        min={90}
        max={360}
        step={90}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            endAngle: Number(v),
          }))
        }
      />
    </Section>
  );
}
