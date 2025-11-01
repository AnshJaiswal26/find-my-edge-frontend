import { Section } from "@layout";
import { ToggleButton, ColorPicker, InputField } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function XAxisSection({ chartId, updateChart, isHorizontal }) {
  return (
    <Section title={isHorizontal ? "Y-Axis" : "X-Axis"}>
      {!isHorizontal && (
        <ToggleButton
          label={"Tooltip"}
          value={(s) => s.charts[chartId].tempLayout.xTooltip}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xTooltip = !chart.tempLayout.xTooltip;
            })
          }
          store={useChartStore}
        />
      )}

      <Section title={"Labels"}>
        <ColorPicker
          label="Color"
          value={(s) => parseColor(s.charts[chartId].tempLayout.xLabelsColor)}
          disable={(s) => s.charts[chartId].tempLayout.xLabels === false}
          onChange={(c) =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xLabels = c;
            })
          }
          store={useChartStore}
        />
        <ToggleButton
          label={"Show"}
          value={(s) => s.charts[chartId].tempLayout.xLabels}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xLabels = !chart.tempLayout.xLabels;
            })
          }
          store={useChartStore}
        />

        <ToggleButton
          label={"Prefix Indexing"}
          value={(s) => s.charts[chartId].tempLayout.xLabelPrefixIndexing}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xLabels = !chart.tempLayout.xLabelPrefixIndexing;
            })
          }
          store={useChartStore}
        />

        <ToggleButton
          label={"Suffix Indexing"}
          value={(s) => s.charts[chartId].tempLayout.xLabelSuffixIndexing}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xLabels = !chart.tempLayout.xLabelSuffixIndexing;
            })
          }
          store={useChartStore}
        />

        <InputField
          label="Prefix"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.xLabelPrefix}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xLabelPrefix = v;
            })
          }
          placeholder="Enter Prefix"
          store={useChartStore}
        />

        <InputField
          label="Suffix"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.xLabelSuffix}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xLabelSuffix = v;
            })
          }
          placeholder="Enter Suffix"
          store={useChartStore}
        />
      </Section>

      <Section title={"Title"}>
        <span className="font-light text-[var(--color-text-charts)] text-[0.85rem]">
          Leave blank to hide the title.{" "}
        </span>
        <InputField
          label="Text"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.xTitleText}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xTitleText = v;
            })
          }
          placeholder={"X-axis title"}
          store={useChartStore}
        />

        <ColorPicker
          label="Color"
          value={(s) => parseColor(s.charts[chartId].tempLayout.xTitleColor)}
          disable={(s) => s.charts[chartId].tempLayout.xTitleText === ""}
          onChange={(c) =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.xTitleColor = c;
            })
          }
          store={useChartStore}
        />
      </Section>
    </Section>
  );
}
