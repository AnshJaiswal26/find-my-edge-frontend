import { Section } from "@shared/components/layout";
import {
  ColorPicker,
  Input,
  Button,
  Select,
  Divider,
} from "@shared/components/ui";
import { DEFAULT_FORMATS, FORMATS } from "@shared/utils";

export default function YAxisSection({
  layoutDraft,
  setLayoutDraft,
  isHorizontal,
  chart,
}) {
  const axisLabel = isHorizontal ? "X-Axis" : "Y-Axis";
  const seriesType = chart.seriesById[chart.seriesOrder[0]].type;

  return (
    <Section title={axisLabel}>
      <div className="space-y-4">
        {/* ---------- Tooltip ---------- */}
        {!isHorizontal && (
          <Button.Toggle
            label="Tooltip"
            hint="Show values on hover"
            value={layoutDraft.yTooltip}
            onChange={(v) => setLayoutDraft((p) => ({ ...p, yTooltip: v }))}
          />
        )}

        <Divider />

        {/* ---------- Labels ---------- */}
        <div className="space-y-4">
          <Button.Toggle
            label="Show Labels"
            hint="Display axis labels"
            value={layoutDraft.yLabels}
            onChange={(v) => setLayoutDraft((p) => ({ ...p, yLabels: v }))}
          />

          <ColorPicker
            label="Label Color"
            value={layoutDraft.yLabelsColor}
            disabled={!layoutDraft.yLabels}
            onCommit={(c) =>
              setLayoutDraft((p) => ({
                ...p,
                yLabelsColor: c,
              }))
            }
          />

          <Select
            vertical
            label="Format"
            value={layoutDraft.yFormat || DEFAULT_FORMATS[seriesType]}
            options={FORMATS[seriesType]}
            onChange={(v) => setLayoutDraft((p) => ({ ...p, yFormat: v }))}
          />

          {seriesType === "number" && (
            <Input
              label="Decimals"
              type="range"
              min={0}
              max={5}
              value={layoutDraft.yDecimals}
              onCommit={(v) =>
                setLayoutDraft((p) => ({
                  ...p,
                  yDecimals: Number(v),
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
            value={layoutDraft.yTitleText}
            onCommit={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                yTitleText: v,
              }))
            }
          />

          <ColorPicker
            label="Title Color"
            value={layoutDraft.yTitleColor}
            disabled={!layoutDraft.yTitleText}
            onCommit={(c) =>
              setLayoutDraft((p) => ({
                ...p,
                yTitleColor: c,
              }))
            }
          />
        </div>
      </div>
    </Section>
  );
}
