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
      {[
        { label: "Tooltip", key: "xTooltip" },
        { label: "Label Index", key: "xLabelIndex" },
      ].map(({ label, key }, i) => (
        <ToggleButton
          className="justify-between"
          label={label}
          selector={(s) => s.charts[chartId].tempLayout[key]}
          onClick={() => toggle(key)}
          store={useChartStore}
        />
      ))}

      <ColorPicker
        label="Labels"
        colorSelector={(s) =>
          parseColor(s.charts[chartId].tempLayout.xLabelsColor)
        }
        disableSelector={(s) => !s.charts[chartId].tempLayout.xLabels}
        onToggle={() => toggle("xLabels")}
        onChange={(c) =>
          updateLayout(chartId, { xLabelsColor: c }, "tempLayout")
        }
        store={useChartStore}
      />

      <InputField
        label="Title Text"
        type="text"
        selector={(s) => s.charts[chartId].tempLayout.xTitleText}
        onChange={(v) => updateLayout(chartId, { xTitleText: v }, "tempLayout")}
        placeholder="X-axis title"
        store={useChartStore}
      />

      <ColorPicker
        label="Title Color"
        colorSelector={(s) =>
          parseColor(s.charts[chartId].tempLayout.xTitleColor)
        }
        disableSelector={(s) => s.charts[chartId].tempLayout.xTitleText === ""}
        onChange={(c) =>
          updateLayout(chartId, { xLabelsColor: c }, "tempLayout")
        }
        store={useChartStore}
      />

      <InputField
        label="Label Prefix"
        type="text"
        selector={(s) => s.charts[chartId].tempLayout.xLabelPrefix}
        onChange={(v) =>
          updateLayout(chartId, { xLabelPrefix: v }, "tempLayout")
        }
        placeholder="Prefix for labels"
        store={useChartStore}
      />
    </Section>
  );
}
