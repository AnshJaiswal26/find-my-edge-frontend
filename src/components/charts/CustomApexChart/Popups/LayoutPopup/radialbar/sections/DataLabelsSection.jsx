import { Section } from "@layout";
import { ColorPicker, InputField } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function RadialTrackSection({ chartId, updateChart }) {
  return (
    <Section title="Track Settings">
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

      <InputField
        label="Stroke Width (%)"
        type="range"
        value={(s) => parseInt(s[chartId].draft.layout.strokeWidth || "50")}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.strokeWidth = `${v}%`;
          })
        }
        min={10}
        max={100}
        store={useChartStore}
      />
    </Section>
  );
}
