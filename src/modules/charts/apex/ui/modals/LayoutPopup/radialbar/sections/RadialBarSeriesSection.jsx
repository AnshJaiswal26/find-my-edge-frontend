import { SEMANTIC_TYPE } from "@lib/analytics/schema";
import { Section } from "@shared/components/layout";
import { ColorPicker, Input, Select } from "@shared/components/ui";
import { FORMATS } from "@shared/utils";

export default function RadialBarSeriesSection({ seriesDraft, updateSeries }) {
  return (
    <div className="space-y-4">
      {seriesDraft.map((series, index) => (
        <Section key={index} title={`Series ${index + 1}`}>
          <div className="space-y-4">
            <Input
              vertical
              label="Label"
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

            {series.type === SEMANTIC_TYPE.NUMBER && (
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
