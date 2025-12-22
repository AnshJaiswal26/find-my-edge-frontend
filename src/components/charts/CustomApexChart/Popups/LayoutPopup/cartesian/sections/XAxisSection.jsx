import { Section } from "@layout";
import { ColorPicker, InputField, Button } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function XAxisSection({ chartId, updateChart, isHorizontal }) {
  return (
    <Section title={isHorizontal ? "Y-Axis" : "X-Axis"}>
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
          value={(s) => parseColor(s[chartId].draft.layout.xLabelsColor)}
          disable={(s) => s[chartId].draft.layout.xLabels === false}
          onChange={(c) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xLabelsColor = c;
            })
          }
          store={useChartStore}
        />
        <Button.Toggle
          label={"Show"}
          value={(s) => s[chartId].draft.layout.xLabels}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xLabels = !chart.draft.layout.xLabels;
            })
          }
          store={useChartStore}
        />

        <Button.Toggle
          label={"Prefix Indexing"}
          value={(s) => s[chartId].draft.layout.xLabelPrefixIndexing}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xLabelPrefixIndexing =
                !chart.draft.layout.xLabelPrefixIndexing;
            })
          }
          store={useChartStore}
        />

        <Button.Toggle
          label={"Suffix Indexing"}
          value={(s) => s[chartId].draft.layout.xLabelSuffixIndexing}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xLabelSuffixIndexing =
                !chart.draft.layout.xLabelSuffixIndexing;
            })
          }
          store={useChartStore}
        />

        <InputField
          label="Prefix"
          type="text"
          value={(s) => s[chartId].draft.layout.xLabelPrefix}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xLabelPrefix = v;
            })
          }
          placeholder="Enter Prefix"
          store={useChartStore}
        />

        <InputField
          label="Suffix"
          type="text"
          value={(s) => s[chartId].draft.layout.xLabelSuffix}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xLabelSuffix = v;
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
        <InputField
          label="Text"
          type="text"
          value={(s) => s[chartId].draft.layout.xTitleText}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xTitleText = v;
            })
          }
          placeholder={"X-axis title"}
          store={useChartStore}
        />

        <ColorPicker
          label="Color"
          value={(s) => parseColor(s[chartId].draft.layout.xTitleColor)}
          disable={(s) => s[chartId].draft.layout.xTitleText === ""}
          onChange={(c) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.xTitleColor = c;
            })
          }
          store={useChartStore}
        />
      </Section>
    </Section>
  );
}
