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
        className="w-[14rem]"
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

      <ToggleButton
        label={"Data Labels"}
        value={(s) => s[chartId].draft.layout.dataLabels}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.dataLabels = !chart.draft.layout.dataLabels;
          })
        }
        store={useChartStore}
      />

      <ToggleButton
        label={"Legend"}
        value={(s) => s[chartId].draft.layout.legend}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.legend = !chart.draft.layout.legend;
          })
        }
        store={useChartStore}
      />

      <InputField
        label="Hollow Size (%)"
        type="range"
        value={(s) =>
          parseInt(s[chartId].draft.layout.hollowSize.replace("%", ""))
        }
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.hollowSize = `${v}%`;
          })
        }
        min={20}
        max={80}
        store={useChartStore}
      />

      <InputField
        label="Start Angle"
        type="number"
        value={(s) => s[chartId].draft.layout.startAngle}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.startAngle = parseInt(v);
          })
        }
        store={useChartStore}
      />

      <InputField
        label="End Angle"
        type="number"
        value={(s) => s[chartId].draft.layout.endAngle}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.endAngle = parseInt(v);
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
