import { ColorPicker, Input } from "@shared/components/ui";
import { Section } from "@shared/components/layout";

export default function LineSeriesSection({ seriesDraft, updateSeries }) {
  return (
    <div className="space-y-4">
      {seriesDraft.map((series, index) => (
        <Section key={index} title={`Series ${index + 1}`}>
          <div className="space-y-6">
            {/* ---------- Identity ---------- */}
            <Input
              vertical
              label="Series Name"
              value={series.name}
              onCommit={(v) => updateSeries(index, { name: v })}
            />

            <Input
              vertical
              label="Tooltip Label"
              value={series.label}
              onCommit={(v) => updateSeries(index, { label: v })}
            />

            {/* ---------- Colors ---------- */}
            <div className="flex flex-wrap gap-3">
              <ColorPicker
                label="Stroke"
                value={series.color}
                onCommit={(c) => updateSeries(index, { color: c })}
              />

              <ColorPicker
                label="Marker"
                value={series.markerColor}
                onCommit={(c) => updateSeries(index, { markerColor: c })}
              />

              <ColorPicker
                label="Area"
                value={series.areaColor}
                onCommit={(c) => updateSeries(index, { areaColor: c })}
              />
            </div>
          </div>
        </Section>
      ))}
    </div>
  );
}
