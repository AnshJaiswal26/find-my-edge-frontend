import { Divider, Section } from "@layout";
import { ColorPicker, Input, Button, Select } from "@ui";
import { DEFAULT_FORMATS, FORMATS } from "@utils";

export default function XAxisSection({
  layoutDraft,
  setLayoutDraft,
  isHorizontal,
  chart,
}) {
  const axisLabel = isHorizontal ? "Y-Axis" : "X-Axis";
  const seriesType = chart.xSeriesConfig.type;

  return (
    <Section title={axisLabel}>
      <div className="space-y-4">
        {/* ---------- Tooltip ---------- */}
        {!isHorizontal && (
          <Button.Toggle
            label="Tooltip"
            hint="Show values on hover"
            value={layoutDraft.xTooltip}
            onChange={(v) => setLayoutDraft((p) => ({ ...p, xTooltip: v }))}
          />
        )}

        <Divider />

        {/* ---------- Labels ---------- */}
        <div className="space-y-4">
          <Button.Toggle
            label="Show Labels"
            hint="Display axis labels"
            value={layoutDraft.xLabels}
            onChange={(v) => setLayoutDraft((p) => ({ ...p, xLabels: v }))}
          />

          <ColorPicker
            label="Label Color"
            value={layoutDraft.xLabelsColor}
            disabled={!layoutDraft.xLabels}
            onCommit={(c) =>
              setLayoutDraft((p) => ({
                ...p,
                xLabelsColor: c,
              }))
            }
          />

          <Select
            vertical
            label="Format"
            value={layoutDraft.xFormat || DEFAULT_FORMATS[seriesType]}
            options={FORMATS[seriesType]}
            onChange={(v) => setLayoutDraft((p) => ({ ...p, xFormat: v }))}
          />

          {seriesType === "number" && (
            <Input
              label="Decimals"
              type="range"
              min={0}
              max={5}
              value={layoutDraft.xDecimals}
              onCommit={(v) =>
                setLayoutDraft((p) => ({
                  ...p,
                  xDecimals: Number(v),
                }))
              }
            />
          )}
        </div>

        <Divider />

        {/* ---------- Title ---------- */}
        <div className="space-y-4">
          <Input
            vertical
            label="Title"
            placeholder={`${axisLabel} title`}
            value={layoutDraft.xTitleText}
            onCommit={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                xTitleText: v,
              }))
            }
          />

          <ColorPicker
            label="Title Color"
            value={layoutDraft.xTitleColor}
            disabled={!layoutDraft.xTitleText}
            onCommit={(c) =>
              setLayoutDraft((p) => ({
                ...p,
                xTitleColor: c,
              }))
            }
          />
        </div>
      </div>
    </Section>
  );
}
