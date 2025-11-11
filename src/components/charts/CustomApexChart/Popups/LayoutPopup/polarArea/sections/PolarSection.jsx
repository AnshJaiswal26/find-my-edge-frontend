import { Section } from "@layout";
import { ColorPicker, InputField } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function PolygonSection({ chartId, updateChart }) {
  return (
    <Section title="Polar">
      <InputField
        label="Polar Stroke Width"
        type="range"
        value={(s) => s[chartId].draft.layout.strokeWidth}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.strokeWidth = v;
          })
        }
        min={0}
        max={10}
        store={useChartStore}
      />

      <InputField
        label="Ring Width"
        type="range"
        value={(s) => s[chartId].draft.layout.ringBorderWidth}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.ringBorderWidth = v;
          })
        }
        min={0}
        max={10}
        store={useChartStore}
      />

      <ColorPicker
        label="Ring Border"
        value={(s) => parseColor(s[chartId].draft.layout.ringBorderColor)}
        onChange={(c) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.ringBorderColor = c;
          })
        }
        resetColor={"var(--color-border-default)"}
        store={useChartStore}
      />

      <InputField
        label="Polar Opacity From"
        type="range"
        value={(s) => s[chartId].draft.layout.fillOpacityFrom}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.fillOpacityFrom = v;
          })
        }
        min={0}
        max={1}
        step={0.1}
        store={useChartStore}
      />

      <InputField
        label="Polar Opacity To"
        type="range"
        value={(s) => s[chartId].draft.layout.fillOpacityTo}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.fillOpacityTo = v;
          })
        }
        min={0}
        max={1}
        step={0.1}
        store={useChartStore}
      />

      <PolarSeries chartId={chartId} updateChart={updateChart} />
    </Section>
  );
}

function PolarSeries({ chartId, updateChart }) {
  const length = useChartStore((s) => s[chartId].draft.seriesConfig.length);

  return Array.from({ length }).map((_, i) => (
    <Section title={`Series ${i + 1}`} subSection={true} key={i}>
      {[
        { label: "Name", key: "name", placeholder: "Enter Name" },
        {
          label: "Tooltip Label",
          key: "tooltipLabel",
          placeholder: "Enter Label",
        },
        { label: "Value Prefix", key: "prefix", placeholder: "Enter Prefix" },
        { label: "Value Suffix", key: "suffix", placeholder: "Enter Suffix" },
      ].map(({ label, key, placeholder }, idx) => (
        <InputField
          key={idx}
          label={label}
          placeholder={placeholder}
          value={(s) => s[chartId].draft.seriesConfig[i][key]}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.seriesConfig[i][key] = v;
            })
          }
          store={useChartStore}
        />
      ))}
      <ColorPicker
        label="Color"
        value={(s) => parseColor(s[chartId].draft.seriesConfig[i].color)}
        onChange={(c) =>
          updateChart(chartId, (chart) => {
            chart.draft.seriesConfig[i].color = c;
          })
        }
        store={useChartStore}
      />
    </Section>
  ));
}
