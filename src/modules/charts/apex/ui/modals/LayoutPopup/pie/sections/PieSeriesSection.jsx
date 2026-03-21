import { Section } from "@shared/components/layout";
import { ColorPicker, Input } from "@shared/components/ui";

export default function PieSeriesSection({ seriesDraft, updateSeries }) {
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
