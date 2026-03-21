import { Section } from "@shared/components/layout";
import { Button, Select } from "@shared/components/ui";

export default function LegendSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Legend">
      <div className="space-y-4">
        {/* ---------- Visibility ---------- */}
        <Button.Toggle
          label="Show"
          hint="Display legend on the chart"
          value={layoutDraft.legend}
          onChange={(v) => setLayoutDraft((p) => ({ ...p, legend: v }))}
        />

        {/* ---------- Position ---------- */}
        <Select
          vertical
          label="Position"
          options={["Top", "Bottom"]}
          getKey={(v) => v.toLowerCase()}
          value={layoutDraft.legendPosition}
          onChange={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              legendPosition: v.toLowerCase(),
            }))
          }
        />

        {/* ---------- Alignment ---------- */}
        <Select
          vertical
          label="Alignment"
          options={["Left", "Center", "Right"]}
          getKey={(v) => v.toLowerCase()}
          value={layoutDraft.legendAlignment}
          onChange={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              legendAlignment: v.toLowerCase(),
            }))
          }
        />
      </div>
    </Section>
  );
}
