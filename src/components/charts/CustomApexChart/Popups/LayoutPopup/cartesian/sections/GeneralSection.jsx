import { Input, Button } from "@ui";
import { Section } from "@layout";
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
        className="flex-1"
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
      <Button.Toggle
        label={"Selection"}
        value={(s) => s[chartId].draft.layout.selection}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.selection = !chart.draft.layout.selection;
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
