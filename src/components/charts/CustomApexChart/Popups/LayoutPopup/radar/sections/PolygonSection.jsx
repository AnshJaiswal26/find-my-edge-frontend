import { Section } from "@layout";
import { ColorPicker, InputField } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function PolygonSection({ chartId, updateChart }) {
  return (
    <Section title="Polygon">
      <InputField
        label="Stroke Width"
        type="range"
        value={(s) => s[chartId].draft.layout.polygonStrokeWidth}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.polygonStrokeWidth = v;
          })
        }
        min={1}
        max={10}
        store={useChartStore}
      />

      <InputField
        label="Opacity"
        type="range"
        value={(s) => s[chartId].draft.layout.radarOpacity}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.radarOpacity = v;
          })
        }
        min={0}
        max={1}
        step={0.1}
        store={useChartStore}
      />

      <div className="flex gap-3">
        <ColorPicker
          label="Stroke"
          value={(s) => parseColor(s[chartId].draft.layout.polygonStroke)}
          onChange={(c) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.polygonStroke = c;
            })
          }
          store={useChartStore}
        />

        <ColorPicker
          label="Fill"
          value={(s) => parseColor(s[chartId].draft.layout.polygonFill)}
          onChange={(c) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.polygonFill = c;
            })
          }
          store={useChartStore}
        />
      </div>
      <RadarSeries chartId={chartId} updateChart={updateChart} />
    </Section>
  );
}

function RadarSeries({ chartId, updateChart }) {
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
