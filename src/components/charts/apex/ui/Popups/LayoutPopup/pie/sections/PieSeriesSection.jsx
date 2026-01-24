import { Section } from "@layout";
import { ColorPicker, Input } from "@ui";

export default function PieSeriesSection({ seriesDraft, updateSeries }) {
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
              value={series.tooltipLabel}
              onCommit={(v) => updateSeries(index, { tooltipLabel: v })}
            />

            <ColorPicker
              label="Slice Color"
              value={series.color}
              onCommit={(c) => updateSeries(index, { color: c })}
            />
          </div>
        </Section>
      ))}
    </div>
  );
}
