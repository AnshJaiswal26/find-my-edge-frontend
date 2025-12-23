import { Section } from "@layout";
import { Button, Input } from "@ui";
import { useChartStore } from "@stores";

export default function GeneralSection({ chartId, updateChart }) {
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

      <Button.Toggle
        label="Data Labels"
        value={(s) => s[chartId].draft.layout.dataLabels}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.dataLabels = !chart.draft.layout.dataLabels;
          })
        }
        store={useChartStore}
      />

      <Input
        label="Radar Size"
        type="range"
        value={(s) => s[chartId].draft.layout.radarSize}
        onChange={(e) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.radarSize = e.target.value;
          })
        }
        min={100}
        max={150}
        store={useChartStore}
      />
    </Section>
  );
}
