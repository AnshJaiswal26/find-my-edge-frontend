import InputField from "../../InputField";
import { ToggleButton } from "../../Buttons";
import ColorPicker from "../../ColorPicker";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";

export default function YAxisSection({ chartId, updateLayout }) {
  const toggle = (key) => {
    const current = useChartStore.getState().charts[chartId].tempLayout[key];
    console.log(current);
    updateLayout(chartId, { [key]: !current }, "tempLayout");
  };

  return (
    <Section title="Y-Axis">
      <ToggleButton
        label={"Tooltip"}
        value={(s) => s.charts[chartId].tempLayout.yTooltip}
        onClick={() => toggle("yTooltip")}
        store={useChartStore}
      />

      <Section title={"Labels"}>
        <ColorPicker
          label="Color"
          value={(s) => parseColor(s.charts[chartId].tempLayout.yLabelsColor)}
          disable={(s) => s.charts[chartId].tempLayout.yLabels === false}
          onChange={(c) =>
            updateLayout(chartId, { yLabelsColor: c }, "tempLayout")
          }
          store={useChartStore}
        />

        <ToggleButton
          label={"Show"}
          value={(s) => s.charts[chartId].tempLayout.yLabels}
          onClick={() => toggle("yLabels")}
          store={useChartStore}
        />

        <InputField
          label="Prefix"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.yLabelPrefix}
          onChange={(v) =>
            updateLayout(chartId, { yLabelPrefix: v }, "tempLayout")
          }
          placeholder="Enter Prefix"
          store={useChartStore}
        />

        <InputField
          label="Suffix"
          type="text"
          value={(s) => s.charts[chartId].tempLayout.yLabelSuffix}
          onChange={(v) =>
            updateLayout(chartId, { yLabelSuffix: v }, "tempLayout")
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
          value={(s) => s.charts[chartId].tempLayout.yTitleText}
          onChange={(v) =>
            updateLayout(chartId, { yTitleText: v }, "tempLayout")
          }
          placeholder={"Y-axis title"}
          store={useChartStore}
        />

        <ColorPicker
          label="Color"
          value={(s) => parseColor(s.charts[chartId].tempLayout.yTitleColor)}
          disable={(s) => s.charts[chartId].tempLayout.yTitleText === ""}
          onChange={(c) =>
            updateLayout(chartId, { yTitleColor: c }, "tempLayout")
          }
          store={useChartStore}
        />
      </Section>
    </Section>
  );
}
