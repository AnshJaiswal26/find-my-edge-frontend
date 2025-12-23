import { Section } from "@layout";
import { Button, Input } from "@ui";
import { useChartStore } from "@stores";

export default function RadialGeneralSection({ chartId, updateChart }) {
  return (
    <Section title="General">
      <Input
        label="Title"
        type="text"
        value={(s) => s[chartId].draft.layout.title}
        onChange={(e) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.title = e.target.value;
          })
        }
        placeholder="Chart title"
        store={useChartStore}
      />

      <Button.Toggle
        label={"Tooltip"}
        value={(s) => s[chartId].draft.layout.tooltip}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.tooltip = !chart.draft.layout.tooltip;
          })
        }
        store={useChartStore}
      />

      <Input
        label="Hollow Size"
        type="range"
        value={(s) => s[chartId].draft.layout.hollowSize}
        formatter={(v) => `${v}%`}
        onChange={(e) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.hollowSize = e.target.value;
          })
        }
        min={30}
        max={80}
        store={useChartStore}
      />

      <Input
        label={"End Angle"}
        type="range"
        value={(s) => parseInt(s[chartId].draft.layout.endAngle)}
        onChange={(e) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.endAngle = e.target.value;
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
