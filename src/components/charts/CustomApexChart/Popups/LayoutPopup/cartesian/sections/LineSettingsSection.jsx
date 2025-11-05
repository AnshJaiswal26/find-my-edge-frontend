import { ToggleButton, ColorPicker, InputField } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";

export default function LineSettingsSection({ chartId, updateChart }) {
  return (
    <>
      {/* Curve Type */}
      <Section title="Line Curve Type">
        {["straight", "smooth", "stepline"].map((curve, i) => (
          <ToggleButton
            key={i}
            label={curve.charAt(0).toUpperCase() + curve.slice(1)}
            value={(s) => s[chartId].draft.layout.curve === curve}
            onClick={() =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.curve = curve;
              })
            }
            store={useChartStore}
          />
        ))}
      </Section>

      {/* Stroke Settings */}
      <Section title="Stroke Settings">
        <InputField
          label="Stroke Width"
          type="range"
          value={(s) => s[chartId].draft.layout.strokeWidth}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.strokeWidth = v;
            })
          }
          min={1}
          max={10}
          store={useChartStore}
        />

        <SeriesColors
          title={"Stroke Color"}
          chartId={chartId}
          updateChart={updateChart}
          type="color"
        />
      </Section>

      {/* Marker Settings */}
      <Section title="Marker Settings">
        <InputField
          label="Marker Size"
          type="range"
          value={(s) => s[chartId].draft.layout.markerSize}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.markerSize = Number(v);
            })
          }
          min={0}
          max={10}
          store={useChartStore}
        />

        <InputField
          label="Marker Hover Size"
          type="range"
          value={(s) => s[chartId].draft.layout.markerHoverSize}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.markerHoverSize = Number(v);
            })
          }
          min={1}
          max={15}
          store={useChartStore}
        />

        <SeriesColors
          title={"Marker Color"}
          updateChart={updateChart}
          chartId={chartId}
        />
      </Section>
      {/* Area Settings */}
      <AreaSettingsSection chartId={chartId} updateChart={updateChart} />
    </>
  );
}

function AreaSettingsSection({ chartId, updateChart }) {
  const isAreaVisible = useChartStore((s) => s[chartId].draft.layout.area);

  return (
    <Section title="Area Settings">
      <ToggleButton
        label="Show Area"
        value={(s) => s[chartId].draft.layout.area}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.area = !chart.draft.layout.area;
          })
        }
        store={useChartStore}
      />

      {isAreaVisible && (
        <>
          <InputField
            label="Area Opacity From"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={(s) => s[chartId].draft.layout.areaOpacityFrom}
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.areaOpacityFrom = parseFloat(v);
              })
            }
            store={useChartStore}
          />

          <InputField
            label="Area Opacity To"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={(s) => s[chartId].draft.layout.areaOpacityTo}
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.areaOpacityTo = parseFloat(v);
              })
            }
            store={useChartStore}
          />

          <ToggleButton
            label={"Area Horizontal"}
            value={(s) => s[chartId].draft.layout.areaGradientHorizontal}
            onClick={() =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.areaGradientHorizontal =
                  !chart.draft.layout.areaGradientHorizontal;
              })
            }
            store={useChartStore}
          />

          <SeriesColors
            title={"Area Color"}
            chartId={chartId}
            updateChart={updateChart}
            type="areaColor"
          />
        </>
      )}
    </Section>
  );
}

function SeriesColors({ title, chartId, updateChart, type = "markerColor" }) {
  const length = useChartStore((s) => s[chartId].draft.seriesConfig.length);

  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length }).map((_, index) => (
        <ColorPicker
          key={index}
          label={`${title} ${index + 1}`}
          value={(s) => parseColor(s[chartId].draft.seriesConfig[index][type])}
          onChange={(c) => {
            updateChart(chartId, (chart) => {
              chart.draft.seriesConfig[index][type] = c;
            });
          }}
          store={useChartStore}
        />
      ))}
    </div>
  );
}
