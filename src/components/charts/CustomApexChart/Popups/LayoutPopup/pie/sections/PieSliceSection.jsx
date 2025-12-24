import { Section } from "@layout";
import { ColorPicker, Input, Select } from "@ui";
import { parseColor } from "@utils";

export default function PieSliceSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
  setSeriesDraft,
}) {
  return (
    <Section title="Pie Slice">
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

      <Input
        label="Slice Stroke Width"
        type="range"
        value={layoutDraft.strokeWidth}
        min={0}
        max={20}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            strokeWidth: Number(v),
          }))
        }
      />

      <PieColors seriesDraft={seriesDraft} setSeriesDraft={setSeriesDraft} />
    </Section>
  );
}

function PieColors({ seriesDraft, setSeriesDraft }) {
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
        label="Slice Color"
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
