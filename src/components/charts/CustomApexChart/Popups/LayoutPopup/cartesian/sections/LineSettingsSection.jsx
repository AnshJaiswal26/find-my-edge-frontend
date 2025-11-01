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
            value={(s) => s.charts[chartId].tempLayout.curve === curve}
            onClick={() =>
              updateChart(chartId, (c) => {
                c.tempLayout.curve = curve;
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
          value={(s) => s.charts[chartId].tempLayout.strokeWidth}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.strokeWidth = v;
            })
          }
          min={1}
          max={10}
          store={useChartStore}
        />

        <SeriesColors
          title={"Stroke Colors"}
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
          value={(s) => s.charts[chartId].tempLayout.markerSize}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.markerSize = Number(v);
            })
          }
          min={0}
          max={10}
          store={useChartStore}
        />

        <InputField
          label="Marker Hover Size"
          type="range"
          value={(s) => s.charts[chartId].tempLayout.markerHoverSize}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.tempLayout.markerHoverSize = Number(v);
            })
          }
          min={1}
          max={15}
          store={useChartStore}
        />

        <SeriesColors
          title={"Marker Colors"}
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
  const isAreaVisible = useChartStore((s) => s.charts[chartId].tempLayout.area);

  return (
    <Section title="Area Settings">
      <ToggleButton
        label="Show Area"
        value={(s) => s.charts[chartId].tempLayout.area}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.area = !chart.tempLayout.area;
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
            value={(s) => s.charts[chartId].tempLayout.areaOpacityFrom}
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.tempLayout.areaOpacityFrom = parseFloat(v);
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
            value={(s) => s.charts[chartId].tempLayout.areaOpacityTo}
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.tempLayout.areaOpacityTo = parseFloat(v);
              })
            }
            store={useChartStore}
          />

          <ToggleButton
            label={"Area Horizontal"}
            value={(s) => s.charts[chartId].tempLayout.areaGradientHorizontal}
            onClick={() =>
              updateChart(chartId, (chart) => {
                chart.tempLayout.areaGradientHorizontal =
                  !chart.tempLayout.areaGradientHorizontal;
              })
            }
            store={useChartStore}
          />

          <SeriesColors
            title={"Area Colors"}
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
  const length = useChartStore(
    (s) => s.charts[chartId].tempSeriesConfig.length
  );

  return (
    <Section title={title}>
      {Array.from({ length }).map((_, index) => (
        <ColorPicker
          key={index}
          label={`Series ${index + 1}`}
          value={(s) =>
            parseColor(s.charts[chartId].tempSeriesConfig[index][type])
          }
          onChange={(c) => {
            updateChart(chartId, (chart) => {
              chart.tempSeriesConfig[index][type] = c;
            });
          }}
          store={useChartStore}
        />
      ))}
    </Section>
  );
}
