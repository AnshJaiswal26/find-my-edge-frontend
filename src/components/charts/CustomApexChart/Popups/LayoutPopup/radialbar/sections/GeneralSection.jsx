import { Section } from "@layout";
import { ToggleButton, InputField } from "@ui";
import { useChartStore } from "@stores";

export default function RadialGeneralSection({ chartId, updateChart }) {
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
        label={"Legend"}
        value={(s) => s.charts[chartId].tempLayout.legend}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.legend = !chart.tempLayout.legend;
          })
        }
        store={useChartStore}
      />

      <InputField
        label="Hollow Size (%)"
        type="range"
        value={(s) =>
          parseInt(s.charts[chartId].tempLayout.hollowSize.replace("%", ""))
        }
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.hollowSize = `${v}%`;
          })
        }
        min={20}
        max={80}
        store={useChartStore}
      />

      <InputField
        label="Start Angle"
        type="number"
        value={(s) => s.charts[chartId].tempLayout.startAngle}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.startAngle = parseInt(v);
          })
        }
        store={useChartStore}
      />

      <InputField
        label="End Angle"
        type="number"
        value={(s) => s.charts[chartId].tempLayout.endAngle}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.endAngle = parseInt(v);
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
