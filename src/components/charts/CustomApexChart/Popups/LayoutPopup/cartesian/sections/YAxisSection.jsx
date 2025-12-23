import { ColorPicker, Input, Button } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";

export default function YAxisSection({ chartId, updateChart, isHorizontal }) {
  return (
    <Section title={isHorizontal ? "X-Axis" : "Y-Axis"}>
      {!isHorizontal && (
        <Button.Toggle
          label={"Tooltip"}
          value={(s) => s[chartId].draft.layout.xTooltip}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xTooltip = !chart.draft.layout.xTooltip;
            })
          }
          store={useChartStore}
        />
      )}

      <Section title={"Labels"}>
        <ColorPicker
          label="Color"
          value={(s) => parseColor(s[chartId].draft.layout.yLabelsColor)}
          disable={(s) => s[chartId].draft.layout.yLabels === false}
          onChange={(c) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.yLabelsColor = c;
            })
          }
          store={useChartStore}
        />

        <Button.Toggle
          label={"Show"}
          value={(s) => s[chartId].draft.layout.yLabels}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.yLabels = !chart.draft.layout.yLabels;
            })
          }
          store={useChartStore}
        />

        <Input
          label="Prefix"
          type="text"
          value={(s) => s[chartId].draft.layout.yLabelPrefix}
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.yLabelPrefix = e.target.value;
            })
          }
          placeholder="Enter Prefix"
          store={useChartStore}
        />

        <Input
          label="Suffix"
          type="text"
          value={(s) => s[chartId].draft.layout.yLabelSuffix}
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.yLabelSuffix = e.target.value;
            })
          }
          placeholder="Enter Suffix"
          store={useChartStore}
        />
      </Section>
      <Section title={"Title"}>
        <span className="font-light text-[var(--text-charts)] text-[0.85rem]">
          Leave blank to hide the title.{" "}
        </span>

        <Input
          label="Text"
          type="text"
          value={(s) => s[chartId].draft.layout.yTitleText}
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.yTitleText = e.target.value;
            })
          }
          placeholder={"Y-axis title"}
          store={useChartStore}
        />

        <ColorPicker
          label="Color"
          value={(s) => parseColor(s[chartId].draft.layout.yTitleColor)}
          disable={(s) => s[chartId].draft.layout.yTitleText === ""}
          onChange={(c) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.yTitleColor = c;
            })
          }
          store={useChartStore}
        />
      </Section>
    </Section>
  );
}
