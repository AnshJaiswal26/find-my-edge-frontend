import { Input, Button } from "@ui";
import { Section } from "@layout";

export default function GeneralSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="General">
      <Input
        label="Title"
        type="text"
        value={layoutDraft.title}
        onCommit={(v) => setLayoutDraft((p) => ({ ...p, title: v }))}
        placeholder="Chart title"
        className="flex-1"
      />

      {[
        { key: "tooltip", label: "Tooltip" },
        { key: "dataLabels", label: "Data Labels" },
        { key: "selection", label: "Selection" },
      ].map(({ key, label }, index) => (
        <Button.Toggle
          key={index}
          label={label}
          value={layoutDraft[key]}
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, [key]: v }))}
        />
      ))}
    </Section>
  );
}
