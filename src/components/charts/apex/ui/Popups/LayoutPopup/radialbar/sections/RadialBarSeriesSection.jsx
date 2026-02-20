import { Section } from "@layout";
import { ColorPicker, Input, Select } from "@ui";
import { FORMATS } from "@utils";

export default function RadialBarSeriesSection({ seriesDraft, updateSeries }) {
  return (
    <div className="space-y-4">
      {seriesDraft.map((series, index) => (
        <Section key={index} title={`Series ${index + 1}`}>
          <div className="space-y-4">
            <Input
              vertical
              label="Name"
              value={series.name}
              onCommit={(v) => updateSeries(index, { name: v })}
            />

            <Input
              vertical
              label="Tooltip Label"
              value={series.label}
              onCommit={(v) => updateSeries(index, { label: v })}
            />

            {/* ---------- Formatting ---------- */}
            <Select
              vertical
              label="Format"
              value={series.format}
              options={FORMATS[series.type]}
              onChange={(v) => updateSeries(index, { format: v })}
            />

            {series.type.includes("number") && (
              <Input
                label="Decimals"
                type="range"
                min={0}
                max={5}
                value={series.decimals}
                onCommit={(v) => updateSeries(index, { decimals: Number(v) })}
              />
            )}

            <ColorPicker
              label="Bar Color"
              value={series.color}
              onCommit={(c) => updateSeries(index, { color: c })}
            />
          </div>
        </Section>
      ))}
    </div>
  );
}
