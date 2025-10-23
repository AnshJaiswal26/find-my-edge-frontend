import InputField from "../../InputField";
import { IconButton, ToggleButton } from "../../Buttons";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import ColorPicker from "../../ColorPicker";
import { Fragment } from "react";
import { parseColor } from "@utils";
import { Plus } from "lucide-react";

export default function BarSettingsSection({ chartId, updateLayout }) {
  return (
    <Section title="Bar Settings">
      {[
        { title: "Horizontal", key: "horizontal" },
        { title: "Stacked", key: "stacked" },
        { title: "Stacked 100%", key: "stacked100" },
      ].map(({ title, key }, i) => (
        <ToggleButton
          key={i}
          label={title}
          value={(s) => s.charts[chartId].tempLayout[key]}
          onClick={() => {
            const current =
              useChartStore.getState().charts[chartId].tempLayout[key];
            updateLayout(chartId, { [key]: !current }, "tempLayout");
          }}
          store={useChartStore}
        />
      ))}

      <InputField
        label="Bar Radius"
        type="range"
        value={(s) => s.charts[chartId].tempLayout.barRadius}
        onChange={(v) => updateLayout(chartId, { barRadius: v }, "tempLayout")}
        min={0}
        max={10}
        store={useChartStore}
      />

      <ConditionalColoring chartId={chartId} />
    </Section>
  );
}

function ConditionalColoring({ chartId }) {
  const seriesCfg = useChartStore((s) => s.charts[chartId].tempSeriesConfig);
  const updateSeriesConfig = useChartStore((s) => s.updateSeriesConfig);

  return (
    <>
      {seriesCfg.map(({ colors, key }, i) => (
        <Section title={`Range Colors - ${key}`} key={i}>
          {colors.map(({ color, label, from, to }, idx) => (
            <Fragment key={idx}>
              <div className="grid grid-cols-3 gap-4 items-end">
                <InputField
                  labelPosition="top"
                  size="medium"
                  label="From"
                  type="number"
                  value={from}
                  onChange={(v) =>
                    updateSeriesConfig(
                      chartId,
                      {
                        key,
                        payload: { from: v },
                        index: idx,
                      },
                      "tempSeriesConfig"
                    )
                  }
                />

                <InputField
                  labelPosition="top"
                  size="medium"
                  label="To"
                  type="number"
                  value={to}
                  onChange={(v) =>
                    updateSeriesConfig(
                      chartId,
                      {
                        key,
                        payload: { to: v },
                        index: idx,
                      },
                      "tempSeriesConfig"
                    )
                  }
                />
                <ColorPicker
                  label="Color"
                  value={parseColor(color)}
                  onChange={(c) =>
                    updateSeriesConfig(
                      chartId,
                      {
                        key,
                        payload: { color: c },
                        index: idx,
                      },
                      "tempSeriesConfig"
                    )
                  }
                  store={useChartStore}
                />

                <InputField
                  labelPosition="top"
                  size="medium"
                  label="Tooltip Label"
                  type="text"
                  value={label}
                  onChange={(v) =>
                    updateSeriesConfig(
                      chartId,
                      {
                        key,
                        payload: { label: v },
                        index: idx,
                      },
                      "tempSeriesConfig"
                    )
                  }
                />
                <InputField
                  labelPosition="top"
                  size="medium"
                  label="Value Prefix"
                  type="text"
                  value={label}
                  onChange={(v) =>
                    updateSeriesConfig(
                      chartId,
                      {
                        key,
                        payload: { label: v },
                        index: idx,
                      },
                      "tempSeriesConfig"
                    )
                  }
                />
                <InputField
                  labelPosition="top"
                  size="medium"
                  label="Value Suffix"
                  type="text"
                  value={label}
                  onChange={(v) =>
                    updateSeriesConfig(
                      chartId,
                      {
                        key,
                        payload: { label: v },
                        index: idx,
                      },
                      "tempSeriesConfig"
                    )
                  }
                />
              </div>

              {colors.length !== idx + 1 && (
                <div className="border-t-1 border-[var(--color-bg-hover)] my-2" />
              )}
            </Fragment>
          ))}
          <IconButton
            icon={<Plus size={15} />}
            tooltip={{ title: "Add Condition", position: "bottom" }}
            className="p-2"
          />
        </Section>
      ))}
    </>
  );
}
