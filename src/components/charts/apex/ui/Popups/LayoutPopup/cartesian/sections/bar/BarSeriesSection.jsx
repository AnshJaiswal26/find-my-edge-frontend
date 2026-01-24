import { ColorRules, Input } from "@ui";
import { Section } from "@layout";

export default function BarSeriesSection({
  seriesDraft,
  setSeriesDraft,
  updateSeries,
}) {
  return (
    <div className="space-y-4">
      {seriesDraft.map((series, index) => {
        const colors = series.colorRules || [];
        if (!colors.length) return null;

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
                type={"number"}
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
