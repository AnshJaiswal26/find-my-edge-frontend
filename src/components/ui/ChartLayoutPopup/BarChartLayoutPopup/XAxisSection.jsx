import { Section } from "@layout";
import { ToggleButton } from "../../Buttons";
import InputField from "../../InputField";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";
import ColorPicker from "../../ColorPicker";

export default function XAxisSection({ chartId, updateLayout }) {
  const toggle = (key) => {
    const current = useChartStore.getState().charts[chartId].tempLayout[key];
    updateLayout(chartId, { [key]: !current }, "tempLayout");
  };

  return (
    <Section title="X-Axis">
      <ToggleButton
        label={"Tooltip"}
        value={(s) => s.charts[chartId].tempLayout.xTooltip}
        onClick={() => toggle("xTooltip")}
        store={useChartStore}
      />

      <Section title={"Labels"}>
        <ColorPicker
          label="Color"
          value={(s) => parseColor(s.charts[chartId].tempLayout.xLabelsColor)}
          disable={(s) => s.charts[chartId].tempLayout.xLabels === false}
          onChange={(c) =>
            updateLayout(chartId, { xLabelsColor: c }, "tempLayout")
          }
          store={useChartStore}
        />
        <ToggleButton
          label={"Show"}
          value={(s) => s.charts[chartId].tempLayout.xLabels}
          onClick={() => toggle("xLabels")}
          store={useChartStore}
        />

        <ToggleButton
          label={"Prefix Indexing"}
          value={(s) => s.charts[chartId].tempLayout.xLabelPrefixIndexing}
          onClick={() => toggle("xLabelPrefixIndexing")}
          store={useChartStore}
        />

        <ToggleButton
          label={"Suffix Indexing"}
          value={(s) => s.charts[chartId].tempLayout.xLabelSuffixIndexing}
          onClick={() => toggle("xLabelSuffixIndexing")}
          store={useChartStore}
        />

        <InputField
          label="Prefix"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.xLabelPrefix}
          onChange={(v) =>
            updateLayout(chartId, { xLabelPrefix: v }, "tempLayout")
          }
          placeholder="Enter Prefix"
          store={useChartStore}
        />

        <InputField
          label="Suffix"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.xLabelSuffix}
          onChange={(v) =>
            updateLayout(chartId, { xLabelSuffix: v }, "tempLayout")
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
            updateLayout(chartId, { xTitleText: v }, "tempLayout")
          }
          placeholder={"X-axis title"}
          store={useChartStore}
        />

        <ColorPicker
          label="Color"
          value={(s) => parseColor(s.charts[chartId].tempLayout.xTitleColor)}
          disable={(s) => s.charts[chartId].tempLayout.xTitleText === ""}
          onChange={(c) =>
            updateLayout(chartId, { xTitleColor: c }, "tempLayout")
          }
          store={useChartStore}
        />
      </Section>
    </Section>
  );
}
