import { Section } from "@layout";
import { Button, Input, Select } from "@ui";
import { DEFAULT_FORMATS, FORMATS } from "@utils";

export default function DataLabelSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
}) {
  return (
    <Section title="Center Labels">
      <Select
        label="Format"
        value={layoutDraft.format || DEFAULT_FORMATS[seriesDraft[0].type]}
        options={FORMATS[seriesDraft[0].type]}
        onChange={(v) => setLayoutDraft((p) => ({ ...p, format: v }))}
      />

      {seriesDraft[0].type === "number" && (
        <Input
          label="Decimals"
          type="range"
          min={0}
          max={5}
          value={layoutDraft.decimals}
          onChange={(e) =>
            setLayoutDraft((p) => ({
              ...p,
              decimals: Number(e.target.value),
            }))
          }
        />
      )}

      {/* Name */}
      <Section>
        <Button.Toggle
          label="Name"
          value={layoutDraft.name}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, name: v }))}
        />
      </Section>

      {/* Value */}
      <Section>
        <Button.Toggle
          label="Value"
          value={layoutDraft.value}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, value: v }))}
        />
      </Section>

      {/* Total */}
      <Section>
        <Button.Toggle
          label="Total"
          value={layoutDraft.total}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, total: v }))}
        />

        <Input
          label="Label"
          value={layoutDraft.totalLabel}
          placeholder="Enter Label"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, totalLabel: v }))}
        />
      </Section>
    </Section>
  );
}
