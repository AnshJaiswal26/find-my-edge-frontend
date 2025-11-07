import { Section } from "@layout";
import { ColorPicker, InputField } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function TrackSection({ chartId, updateChart }) {
  return (
    <Section title="Track">
      <InputField
        label={"Track Width"}
        type="range"
        value={(s) => s[chartId].draft.layout.strokeWidth}
        formatter={(v) => `${v}%`}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.strokeWidth = v;
          })
        }
        min={0}
        max={100}
        store={useChartStore}
      />

      <ColorPicker
        label="Background"
        value={(s) => parseColor(s[chartId].draft.layout.trackBackground)}
        onChange={(c) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.trackBackground = c;
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
