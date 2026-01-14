import { Section } from "@layout";
import { ColorPicker, Input, Button } from "@ui";
import { parseColor } from "@utils";

export default function XAxisSection({
  layoutDraft,
  setLayoutDraft,
  isHorizontal,
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

        <Button.Toggle
          label="Prefix Indexing"
          value={layoutDraft.xLabelPrefixIndexing}
          onChange={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              xLabelPrefixIndexing: v,
            }))
          }
        />

        <Button.Toggle
          label="Suffix Indexing"
          value={layoutDraft.xLabelSuffixIndexing}
          onChange={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              xLabelSuffixIndexing: v,
            }))
          }
        />

        <Input
          label="Prefix"
          type="text"
          value={layoutDraft.xLabelPrefix}
          placeholder="Enter Prefix"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, xLabelPrefix: v }))}
        />

        <Input
          label="Suffix"
          type="text"
          value={layoutDraft.xLabelSuffix}
          placeholder="Enter Suffix"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, xLabelSuffix: v }))}
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
