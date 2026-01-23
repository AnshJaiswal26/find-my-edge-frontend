import { Section } from "@layout";
import { ColorPicker, Input, Button, Select } from "@ui";
import { DEFAULT_FORMATS, FORMATS, parseColor } from "@utils";

export default function XAxisSection({
  layoutDraft,
  setLayoutDraft,
  isHorizontal,
  type,
  chart,
}) {
  return (
    <Section title={isHorizontal ? "Y-Axis" : "X-Axis"}>
      {!isHorizontal && (
        <Button.Toggle
          label="Tooltip"
          value={layoutDraft.xTooltip}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, xTooltip: v }))}
        />
      )}

      {/* Labels */}
      <Section title="Labels">
        <ColorPicker
          label="Color"
          value={parseColor(layoutDraft.xLabelsColor)}
          disabled={!layoutDraft.xLabels}
          onCommit={(c) => setLayoutDraft((p) => ({ ...p, xLabelsColor: c }))}
        />

        <Button.Toggle
          label="Show"
          value={layoutDraft.xLabels}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, xLabels: v }))}
        />

        <Select
          label="Format"
          value={
            layoutDraft.xFormat || DEFAULT_FORMATS[chart.xSeriesConfig.type]
          }
          options={FORMATS[chart.xSeriesConfig.type]}
          onChange={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              xFormat: v,
            }))
          }
        />

        {chart.xSeriesConfig.type === "number" && (
          <Input
            label="Decimals"
            type="range"
            min={0}
            max={5}
            value={layoutDraft.xDecimals}
            onChange={(e) =>
              setLayoutDraft((p) => ({
                ...p,
                xDecimals: Number(e.target.value),
              }))
            }
          />
        )}
      </Section>

      {/* Title */}
      <Section title="Title">
        <span className="font-light text-[var(--text-charts)] text-[0.85rem]">
          Leave blank to hide the title.
        </span>

        <Input
          label="Text"
          type="text"
          value={layoutDraft.xTitleText}
          placeholder="X-axis title"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, xTitleText: v }))}
        />

        <ColorPicker
          label="Color"
          value={parseColor(layoutDraft.xTitleColor)}
          disabled={!layoutDraft.xTitleText}
          onCommit={(c) => setLayoutDraft((p) => ({ ...p, xTitleColor: c }))}
        />
      </Section>
    </Section>
  );
}
