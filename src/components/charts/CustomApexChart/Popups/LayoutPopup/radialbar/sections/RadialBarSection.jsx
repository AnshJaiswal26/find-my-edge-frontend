import { Section } from "@layout";
import { ColorPicker, Input, Select } from "@ui";
import { parseColor } from "@utils";

export default function RadialBarSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
  setSeriesDraft,
}) {
  return (
    <Section title="Radial Bar">
      <Select
        label="Gradient Type"
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
        label="Radial Line Cap"
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

      <RadialBarColors
        seriesDraft={seriesDraft}
        setSeriesDraft={setSeriesDraft}
      />
    </Section>
  );
}

function RadialBarColors({ seriesDraft, setSeriesDraft }) {
  return seriesDraft.map((series, i) => (
    <Section title={`Series ${i + 1}`} key={i} subSection>
      <Input
        label="Name"
        value={series.name}
        onCommit={(v) =>
          setSeriesDraft((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], name: v };
            return next;
          })
        }
      />

      <Input
        label="Tooltip Label"
        value={series.tooltipLabel}
        onCommit={(v) =>
          setSeriesDraft((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], tooltipLabel: v };
            return next;
          })
        }
      />

      <ColorPicker
        label="Bar Color"
        value={parseColor(series.color)}
        onCommit={(c) =>
          setSeriesDraft((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], color: c };
            return next;
          })
        }
      />
    </Section>
  ));
}
