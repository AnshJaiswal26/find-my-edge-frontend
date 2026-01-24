import { Section } from "@layout";
import { Button, Input } from "@ui";

export default function GeneralSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="General">
      <div className="space-y-4">
        {/* ---------- Title ---------- */}
        <Input
          vertical
          label="Title"
          type="text"
          placeholder="Chart title"
          value={layoutDraft.title}
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, title: v }))}
        />

        {/* ---------- Tooltip ---------- */}
        <Button.Toggle
          label="Tooltip"
          hint="Show tooltip on hover"
          value={layoutDraft.tooltip}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, tooltip: v }))}
        />

        {/* ---------- Data Labels ---------- */}
        <Button.Toggle
          label="Data Labels"
          hint="Display values on chart"
          value={layoutDraft.dataLabels}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, dataLabels: v }))}
        />

        {/* ---------- Donut Size ---------- */}
        <Input
          label="Donut Size"
          type="range"
          min={0}
          max={95}
          formatter={(v) => `${v}%`}
          value={layoutDraft.donutSize}
          onCommit={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              donutSize: Number(v),
            }))
          }
        />
      </div>
    </Section>
  );
}
