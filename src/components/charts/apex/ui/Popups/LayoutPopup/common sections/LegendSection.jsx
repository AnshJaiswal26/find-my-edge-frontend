import { Section } from "@layout";
import { Button, Select } from "@ui";

export default function LegendSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Legend">
      <Button.Toggle
        label="Show"
        value={layoutDraft.legend}
        onChange={(v) => setLayoutDraft((p) => ({ ...p, legend: v }))}
      />

      <Select
        label="Position"
        options={["Top", "Bottom"]}
        getKey={(v) => v.toLowerCase()}
        value={layoutDraft.legendPosition}
        onChange={(v) =>
          setLayoutDraft((p) => ({ ...p, legendPosition: v.toLowerCase() }))
        }
      />

      <Select
        label="Alignment"
        options={["Left", "Center", "Right"]}
        getKey={(v) => v.toLowerCase()}
        value={layoutDraft.legendAlignment}
        onChange={(v) =>
          setLayoutDraft((p) => ({ ...p, legendAlignment: v.toLowerCase() }))
        }
      />
    </Section>
  );
}
