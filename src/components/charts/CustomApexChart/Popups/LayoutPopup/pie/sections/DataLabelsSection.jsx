import { Section } from "@layout";
import { Button, Input } from "@ui";

export default function DataLabelSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Center Labels">
      {/* Name */}
      <Section title="Name" subSection>
        <Button.Toggle
          label="Show"
          value={layoutDraft.name}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, name: v }))}
        />
      </Section>

      {/* Value */}
      <Section title="Value" subSection>
        <Button.Toggle
          label="Show"
          value={layoutDraft.value}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, value: v }))}
        />

        <Input
          label="Prefix"
          value={layoutDraft.valuePrefix}
          placeholder="Enter Prefix"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, valuePrefix: v }))}
        />

        <Input
          label="Suffix"
          value={layoutDraft.valueSuffix}
          placeholder="Enter Suffix"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, valueSuffix: v }))}
        />
      </Section>

      {/* Total */}
      <Section title="Total" subSection>
        <Button.Toggle
          label="Show"
          value={layoutDraft.total}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, total: v }))}
        />

        <Input
          label="Label"
          value={layoutDraft.totalLabel}
          placeholder="Enter Label"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, totalLabel: v }))}
        />

        <Input
          label="Prefix"
          value={layoutDraft.totalPrefix}
          placeholder="Enter Prefix"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, totalPrefix: v }))}
        />

        <Input
          label="Suffix"
          value={layoutDraft.totalSuffix}
          placeholder="Enter Suffix"
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, totalSuffix: v }))}
        />
      </Section>
    </Section>
  );
}
