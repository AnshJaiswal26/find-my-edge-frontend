import { Section } from "@layout";
import { ColorPicker, InputField, Select } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function RadialTrackSection({ chartId, updateChart }) {
  return (
    <Section title="Bar And Track">
      <Select
        label={"Gradient Type"}
        value={(s) => s[chartId].draft.layout.gradientType}
        options={{ gradient: "Gradient", solid: "Solid" }}
        onChange={(k) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.gradientType = k;
          })
        }
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

      {[
        { label: "Track Width", key: "strokeWidth", min: 0, max: 100 },
        { label: "Start Angle", key: "startAngle", min: 0, max: 360 },
        { label: "End Angle", key: "endAngle", min: 0, max: 360 },
      ].map(({ label, key, min, max }, i) => (
        <InputField
          key={i}
          label={label}
          type="range"
          value={(s) => parseInt(s[chartId].draft.layout[key])}
          formatter={(v) => (key === "strokeWidth" ? `${v}%` : v)}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout[key] = key === "strokeWidth" ? `${v}%` : v;
            })
          }
          min={min}
          max={max}
          store={useChartStore}
        />
      ))}
    </Section>
  );
}
