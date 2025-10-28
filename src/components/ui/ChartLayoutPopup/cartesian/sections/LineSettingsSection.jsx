import { ToggleButton, ColorPicker, InputField, Button } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import styles from "../CartesianLayoutPopup.module.css";

export default function LineSettingsSection({ chartId, updateLayout }) {
  return (
    <>
      {/* Curve Type */}
      <Section title="Line Curve Type">
        {["straight", "smooth", "stepline"].map((curve, i) => (
          <ToggleButton
            key={i}
            label={curve.charAt(0).toUpperCase() + curve.slice(1)}
            value={(s) => s.charts[chartId].tempLayout.curve === curve}
            onClick={() => updateLayout(chartId, { curve }, "tempLayout")}
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
            updateLayout(chartId, { strokeWidth: Number(v) }, "tempLayout")
          }
          min={1}
          max={10}
          store={useChartStore}
        />
      </Section>

      {/* Marker Settings */}
      <Section title="Marker Settings">
        <InputField
          label="Marker Size"
          type="range"
          value={(s) => s.charts[chartId].tempLayout.markerSize}
          onChange={(v) =>
            updateLayout(chartId, { markerSize: Number(v) }, "tempLayout")
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
            updateLayout(chartId, { markerHoverSize: Number(v) }, "tempLayout")
          }
          min={1}
          max={15}
          store={useChartStore}
        />

        <MarkerColors chartId={chartId} updateLayout={updateLayout} />
      </Section>
    </>
  );
}

function MarkerColors({ chartId, updateLayout }) {
  const markerColors = useChartStore(
    (s) => s.charts[chartId].tempLayout.markerColors
  );

  return (
    <Section title="Marker Colors">
      <div className={styles.colorRangeGrid}>
        {markerColors.map((color, idx) => (
          <ColorPicker
            key={idx}
            label={`Marker ${idx + 1}`}
            value={color}
            onChange={(c) => {
              const updated = [...markerColors];
              updated[idx] = c;
              updateLayout(chartId, { markerColors: updated }, "tempLayout");
            }}
            store={useChartStore}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          text="Add Color"
          size="medium"
          onClick={() =>
            updateLayout(
              chartId,
              { markerColors: [...markerColors, "var(--color-cyan)"] },
              "tempLayout"
            )
          }
        />
      </div>
    </Section>
  );
}
