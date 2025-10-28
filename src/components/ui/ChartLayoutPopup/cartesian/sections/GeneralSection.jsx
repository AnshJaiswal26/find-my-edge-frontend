import { ToggleButton, InputField } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";

export default function GeneralSection({ chartId, updateLayout }) {
  const toggle = (key) => {
    const current = useChartStore.getState().charts[chartId].tempLayout[key];
    updateLayout(chartId, { [key]: !current }, "tempLayout");
  };

  return (
    <Section title="General">
      <InputField
        label="Title"
        type="text"
        value={(s) => s.charts[chartId].tempLayout.title}
        onChange={(v) => updateLayout(chartId, { title: v }, "tempLayout")}
        placeholder="Chart title"
        className="w-[14rem]"
        store={useChartStore}
      />

      <ToggleButton
        label={"Tooltip"}
        value={(s) => s.charts[chartId].tempLayout.tooltip}
        onClick={() => toggle("tooltip")}
        store={useChartStore}
      />
      <ToggleButton
        label={"Data Labels"}
        value={(s) => s.charts[chartId].tempLayout.dataLabels}
        onClick={() => toggle("dataLabels")}
        store={useChartStore}
      />
      <InputField
        label="Chart Width (%)"
        type="range"
        formatter={(v) => `${v}%`}
        value={(s) => s.charts[chartId].tempLayout.dimensionX}
        onChange={(v) => updateLayout(chartId, { dimensionX: v }, "tempLayout")}
        min={50}
        max={100}
        store={useChartStore}
      />
      <InputField
        label="Chart Height (px)"
        type="range"
        formatter={(v) => `${v}px`}
        value={(s) => s.charts[chartId].tempLayout.dimensionY}
        onChange={(v) => updateLayout(chartId, { dimensionY: v }, "tempLayout")}
        min={250}
        max={500}
        store={useChartStore}
      />
    </Section>
  );
}
