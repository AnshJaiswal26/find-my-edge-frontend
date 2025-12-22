import { Section } from "@layout";
import { Button, InputField } from "@ui";
import { useChartStore } from "@stores";

export default function GeneralSection({ chartId, updateChart }) {
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
        label={"Data Labels"}
        value={(s) => s[chartId].draft.layout.dataLabels}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.dataLabels = !chart.draft.layout.dataLabels;
          })
        }
        store={useChartStore}
      />

      <InputField
        label="Donut Size"
        type="range"
        value={(s) => s[chartId].draft.layout.donutSize}
        formatter={(v) => `${v}%`}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.donutSize = v;
          })
        }
        min={0}
        max={95}
        store={useChartStore}
      />
    </Section>
  );
}
