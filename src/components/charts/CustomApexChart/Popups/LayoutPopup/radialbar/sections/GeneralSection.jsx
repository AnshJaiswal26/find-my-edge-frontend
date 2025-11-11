import { Section } from "@layout";
import { ToggleButton, InputField } from "@ui";
import { useChartStore } from "@stores";

export default function RadialGeneralSection({ chartId, updateChart }) {
  return (
    <Section title="General">
      <InputField
        label="Title"
        type="text"
        value={(s) => s[chartId].draft.layout.title}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.title = v;
          })
        }
        placeholder="Chart title"
        store={useChartStore}
      />

      <ToggleButton
        label={"Tooltip"}
        value={(s) => s[chartId].draft.layout.tooltip}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.tooltip = !chart.draft.layout.tooltip;
          })
        }
        store={useChartStore}
      />

      <InputField
        label="Hollow Size"
        type="range"
        value={(s) => s[chartId].draft.layout.hollowSize}
        formatter={(v) => `${v}%`}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.hollowSize = v;
          })
        }
        min={30}
        max={80}
        store={useChartStore}
      />

      <InputField
        label={"End Angle"}
        type="range"
        value={(s) => parseInt(s[chartId].draft.layout.endAngle)}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.endAngle = v;
          })
        }
        min={90}
        max={360}
        step={90}
        store={useChartStore}
      />
    </Section>
  );
}
