import { Section } from "@layout";
import { ToggleButton } from "../../Buttons";
import InputField from "../../InputField";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";
import ColorPicker from "../../ColorPicker";

export function XAxisSection({ chartId, updateLayout }) {
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
          label={"Indexing"}
          value={(s) => s.charts[chartId].tempLayout.xLabelIndex}
          onClick={() => toggle("xLabelIndex")}
          store={useChartStore}
        />

        <InputField
          label="Label Prefix"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.xLabelPrefix}
          onChange={(v) =>
            updateLayout(chartId, { xLabelPrefix: v }, "tempLayout")
          }
          placeholder="Prefix for labels"
          store={useChartStore}
        />
      </Section>

      <Section title={"Title"}>
        <InputField
          label="Text"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.xTitleText}
          onChange={(v) =>
            updateLayout(chartId, { xTitleText: v }, "tempLayout")
          }
          placeholder="X-axis title"
          store={useChartStore}
        />

        <ColorPicker
          label="Color"
          value={(s) => parseColor(s.charts[chartId].tempLayout.xTitleColor)}
          disable={(s) => s.charts[chartId].tempLayout.xTitleText === ""}
          onChange={(c) =>
            updateLayout(chartId, { xLabelsColor: c }, "tempLayout")
          }
          store={useChartStore}
        />
      </Section>
    </Section>
  );
}
