import { ColorPicker, Input, Button } from "@ui";
import { Section } from "@layout";
import { parseColor } from "@utils";

export default function YAxisSection({
  layoutDraft,
  setLayoutDraft,
  isHorizontal,
}) {
  return (
    <Section title={isHorizontal ? "X-Axis" : "Y-Axis"}>
      {!isHorizontal && (
        <Button.Toggle
          label="Tooltip"
          value={layoutDraft.yTooltip}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, yTooltip: v }))}
        />
      )}

      {/* Labels */}
      <Section title="Labels">
        <ColorPicker
          label="Color"
          value={parseColor(layoutDraft.yLabelsColor)}
          disabled={!layoutDraft.yLabels}
          onCommit={(c) => setLayoutDraft((p) => ({ ...p, yLabelsColor: c }))}
        />

        <Button.Toggle
          label="Show"
          value={layoutDraft.yLabels}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, yLabels: v }))}
        />

        <Input
          label="Prefix"
          type="text"
          value={layoutDraft.yLabelPrefix}
          placeholder="Enter Prefix"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, yLabelPrefix: v }))}
        />

        <Input
          label="Suffix"
          type="text"
          value={layoutDraft.yLabelSuffix}
          placeholder="Enter Suffix"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, yLabelSuffix: v }))}
        />
      </Section>

      {/* Title */}
      <Section title="Title">
        <span className="font-light text-[var(--text-charts)] text-[0.85rem]">
          Leave blank to hide the title.
        </span>

        <Input
          label="Text"
          type="text"
          value={layoutDraft.yTitleText}
          placeholder="Y-axis title"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, yTitleText: v }))}
        />

        <ColorPicker
          label="Color"
          value={parseColor(layoutDraft.yTitleColor)}
          disabled={!layoutDraft.yTitleText}
          onCommit={(c) => setLayoutDraft((p) => ({ ...p, yTitleColor: c }))}
        />
      </Section>
    </Section>
  );
}
