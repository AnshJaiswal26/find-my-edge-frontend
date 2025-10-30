import { ToggleButton, InputField } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";

export default function GeneralSection({ chartId, updateChart }) {
  return (
    <Section title="General">
      <InputField
        label="Title"
        type="text"
        value={(s) => s.charts[chartId].tempLayout.title}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.title = v;
          })
        }
        placeholder="Chart title"
        className="w-[14rem]"
        store={useChartStore}
      />

      <ToggleButton
        label={"Tooltip"}
        value={(s) => s.charts[chartId].tempLayout.tooltip}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.tooltip = !chart.tempLayout.tooltip;
          })
        }
        store={useChartStore}
      />
      <ToggleButton
        label={"Data Labels"}
        value={(s) => s.charts[chartId].tempLayout.dataLabels}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.dataLabels = !chart.tempLayout.dataLabels;
          })
        }
        store={useChartStore}
      />
      <ToggleButton
        label={"Selection"}
        value={(s) => s.charts[chartId].tempLayout.selection}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.selection = !chart.tempLayout.selection;
          })
        }
        store={useChartStore}
      />
      <InputField
        label="Chart Width (%)"
        type="range"
        formatter={(v) => `${v}%`}
        value={(s) => s.charts[chartId].tempLayout.dimensionX}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.dimensionX = v;
          })
        }
        min={50}
        max={100}
        store={useChartStore}
      />
      <InputField
        label="Chart Height (px)"
        type="range"
        formatter={(v) => `${v}px`}
        value={(s) => s.charts[chartId].tempLayout.dimensionY}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.dimensionY = v;
          })
        }
        min={250}
        max={500}
        store={useChartStore}
      />
    </Section>
  );
}
