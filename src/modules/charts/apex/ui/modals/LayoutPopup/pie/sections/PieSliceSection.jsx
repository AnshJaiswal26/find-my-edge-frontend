import { Section } from "@shared/components/layout";
import { Input, Select } from "@shared/components/ui";

export default function PieSliceSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Slice">
      <div className="space-y-4">
        <Select
          vertical
          label="Fill Type"
          options={["Gradient", "Solid"]}
          getKey={(v) => v.toLowerCase()}
          value={layoutDraft.gradientType}
          onChange={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              gradientType: v.toLowerCase(),
            }))
          }
        />

        <Input
          label="Stroke Width"
          type="range"
          min={0}
          max={20}
          value={layoutDraft.strokeWidth}
          onCommit={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              strokeWidth: Number(v),
            }))
          }
        />
      </div>
    </Section>
  );
}
