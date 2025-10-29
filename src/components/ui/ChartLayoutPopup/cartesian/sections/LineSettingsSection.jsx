import { ToggleButton, ColorPicker, InputField } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";

export default function LineSettingsSection({
  chartId,
  updateChart,
  tempLayout,
}) {
  return (
    <>
      {/* Curve Type */}
      <Section title="Line Curve Type">
        {["straight", "smooth", "stepline"].map((curve, i) => (
          <ToggleButton
            key={i}
            label={curve.charAt(0).toUpperCase() + curve.slice(1)}
            value={(s) => s.charts[chartId].tempLayout.curve === curve}
            onClick={() => updateChart(chartId, { tempLayout: { curve } })}
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
            updateChart(chartId, { tempLayout: { strokeWidth: v } })
          }
          min={1}
          max={10}
          store={useChartStore}
        />

        {tempLayout.markerColors.map((color, idx) => (
          <ColorPicker
            key={idx}
            label={`Series ${idx + 1}`}
            value={(s) =>
              parseColor(s.charts[chartId].tempLayout.markerColors[idx])
            }
            onChange={(c) =>
              updateChart(chartId, {
                tempLayout: (p) => {
                  const updated = [...p.markerColors];
                  updated[idx] = c;
                  return { markerColors: updated };
                },
              })
            }
            store={useChartStore}
          />
        ))}
      </Section>

      {/* Marker Settings */}
      <Section title="Marker Settings">
        <InputField
          label="Marker Size"
          type="range"
          value={(s) => s.charts[chartId].tempLayout.markerSize}
          onChange={(v) =>
            updateLayout(chartId, { tempLayout: { markerSize: Number(v) } })
          }
          min={1}
          max={10}
          store={useChartStore}
        />

        <InputField
          label="Marker Hover Size"
          type="range"
          value={(s) => s.charts[chartId].tempLayout.markerHoverSize}
          onChange={(v) =>
            updateLayout(chartId, {
              tempLayout: { markerHoverSize: Number(v) },
            })
          }
          min={1}
          max={15}
          store={useChartStore}
        />

        <MarkerColors
          chartId={chartId}
          updateChart={updateChart}
          tempLayout={tempLayout}
        />

        {/* Area Settings */}
        <AreaSettingsSection
          chartId={chartId}
          updateChart={updateChart}
          tempLayout={tempLayout}
        />
      </Section>
    </>
  );
}

function AreaSettingsSection({ chartId, updateChart, tempLayout }) {
  return (
    <Section title="Area Settings">
      <ToggleButton
        label="Show Area"
        value={(s) => s.charts[chartId].tempLayout.area}
        onClick={() =>
          updateChart(chartId, {
            tempLayout: (p) => ({ area: !p.area }),
          })
        }
        store={useChartStore}
      />

      {tempLayout.area && (
        <>
          <InputField
            label="Area Opacity From"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={(s) => s.charts[chartId].tempLayout.areaOpacityFrom}
            onChange={(v) =>
              updateChart(chartId, {
                tempLayout: { areaOpacityFrom: parseFloat(v) },
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
              updateChart(chartId, {
                tempLayout: { areaOpacityTo: parseFloat(v) },
              })
            }
            store={useChartStore}
          />

          <Section title="Area Gradient Type">
            <ToggleButton
              label={"Horizontal"}
              value={(s) => s.charts[chartId].tempLayout.areaGradientHorizontal}
              onClick={() =>
                updateChart(chartId, {
                  tempLayout: (p) => ({
                    areaGradientHorizontal: !p.areaGradientHorizontal,
                  }),
                })
              }
              store={useChartStore}
            />
          </Section>

          <Section title="Area Colors">
            {tempLayout.areaColors.map((color, idx) => (
              <ColorPicker
                key={idx}
                label={`Series ${idx + 1}`}
                value={(s) =>
                  parseColor(s.charts[chartId].tempLayout.areaColors[idx])
                }
                onChange={(c) => {
                  updateChart(chartId, {
                    tempLayout: (p) => {
                      const updated = [...p.areaColors];
                      updated[idx] = c;
                      return { areaColors: updated };
                    },
                  });
                }}
                store={useChartStore}
              />
            ))}
          </Section>
        </>
      )}
    </Section>
  );
}

function MarkerColors({ chartId, updateChart, tempLayout }) {
  return (
    <Section title="Marker Colors">
      {tempLayout.markerColors.map((color, idx) => (
        <ColorPicker
          key={idx}
          label={`Series ${idx + 1}`}
          value={(s) =>
            parseColor(s.charts[chartId].tempLayout.markerColors[idx])
          }
          onChange={(c) => {
            updateChart(chartId, {
              tempLayout: (p) => {
                const updated = [...p.markerColors];
                updated[idx] = c;
                return { markerColors: updated };
              },
            });
          }}
          store={useChartStore}
        />
      ))}
    </Section>
  );
}
