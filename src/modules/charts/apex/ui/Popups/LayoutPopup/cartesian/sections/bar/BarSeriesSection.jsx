import { ColorRules, Input } from "@shared/components/ui";
import { Section } from "@shared/components/layout";

export default function BarSeriesSection({
  seriesDraft,
  setSeriesDraft,
  updateSeries,
}) {
  return (
    <div className="space-y-4">
      {seriesDraft.map((series, index) => {
        const colors = series.colorRules || [];

        return (
          <Section key={index} title={`Series ${index + 1}`}>
            <div className="space-y-6">
              {/* ---------- Series Name ---------- */}
              <Input
                label="Series Name"
                value={series.name}
                onCommit={(v) => updateSeries(index, { name: v })}
              />

              <ColorRules
                section={false}
                rules={colors}
                type={series.type}
                label
                onChange={(callBack) =>
                  setSeriesDraft((p) => {
                    const next = [...p];
                    next[index] = { ...callBack(p[index]) };
                    return next;
                  })
                }
              />
            </div>
          </Section>
        );
      })}
    </div>
  );
}
