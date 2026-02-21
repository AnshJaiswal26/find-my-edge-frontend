import { Section } from "@shared/components/layout";
import { Button, Input } from "@shared/components/ui";

export default function GeneralSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="General">
      <Input
        label="Title"
        classNames={{ input: "max-w-full!" }}
        type="text"
        value={layoutDraft.title}
        placeholder="Chart title"
        onCommit={(v) => setLayoutDraft((p) => ({ ...p, title: v }))}
      />

      <Button.Toggle
        label="Tooltip"
        value={layoutDraft.tooltip}
        onChange={(v) => setLayoutDraft((p) => ({ ...p, tooltip: v }))}
      />

      <Button.Toggle
        label="Data Labels"
        value={layoutDraft.dataLabels}
        onChange={(v) => setLayoutDraft((p) => ({ ...p, dataLabels: v }))}
      />

      <Input
        label="Radar Size"
        type="range"
        value={layoutDraft.radarSize}
        min={100}
        max={150}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            radarSize: Number(v),
          }))
        }
      />
    </Section>
  );
}
