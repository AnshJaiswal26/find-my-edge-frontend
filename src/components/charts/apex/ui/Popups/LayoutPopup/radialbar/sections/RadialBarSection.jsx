import { Section } from "@layout";
import { Select } from "@ui";

export default function RadialBarSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Radial Bar">
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

        <Select
          vertical
          label="Line Cap"
          options={["Round", "Square"]}
          getKey={(v) => v.toLowerCase()}
          value={layoutDraft.strokeLineCap}
          onChange={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              strokeLineCap: v.toLowerCase(),
            }))
          }
        />
      </div>
    </Section>
  );
}
