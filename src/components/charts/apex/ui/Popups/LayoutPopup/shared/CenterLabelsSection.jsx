import { Divider, Section } from "@layout";
import { Button, Input, Select } from "@ui";
import { DEFAULT_FORMATS, FORMATS } from "@utils";

export default function CenterLabelSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
}) {
  const seriesType = seriesDraft[0].type;

  return (
    <Section title="Center Labels">
      <div className="space-y-4">
        {/* ---------- Visibility ---------- */}
        <Button.Toggle
          label="Name"
          hint="Show series name"
          value={layoutDraft.name}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, name: v }))}
        />

        <Button.Toggle
          label="Value"
          hint="Show slice value"
          value={layoutDraft.value}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, value: v }))}
        />

        <Button.Toggle
          label="Total"
          hint="Show total value"
          value={layoutDraft.total}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, total: v }))}
        />

        {layoutDraft.total && (
          <Input
            vertical
            label="Total Label"
            placeholder="Enter label"
            value={layoutDraft.totalLabel}
            onCommit={(v) => setLayoutDraft((p) => ({ ...p, totalLabel: v }))}
          />
        )}

        <Select
          vertical
          label="Aggregate"
          value={layoutDraft.reducer.replace("_N", "")}
          options={["SUM", "COUNT", "AVG", "MAX", "MIN"]}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, reducer: `${v}_N` }))}
        />

        <Divider />

        {/* ---------- Formatting ---------- */}
        <Select
          vertical
          label="Format"
          value={layoutDraft.format || DEFAULT_FORMATS[seriesType]}
          options={FORMATS[seriesType]}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, format: v }))}
        />

        {seriesType === "number" && (
          <Input
            label="Decimals"
            type="range"
            min={0}
            max={5}
            value={layoutDraft.decimals}
            onCommit={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                decimals: Number(v),
              }))
            }
          />
        )}
      </div>
    </Section>
  );
}
