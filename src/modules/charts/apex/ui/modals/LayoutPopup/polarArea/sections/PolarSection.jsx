import { Section } from "@shared/components/layout";
import { ColorPicker, Input } from "@shared/components/ui";

export default function PolarSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
  setSeriesDraft,
}) {
  return (
    <Section title="Polar">
      <Input
        label="Polar Stroke Width"
        type="range"
        value={layoutDraft.strokeWidth}
        min={0}
        max={10}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            strokeWidth: Number(v),
          }))
        }
      />

      <Input
        label="Ring Width"
        type="range"
        value={layoutDraft.ringBorderWidth}
        min={0}
        max={10}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            ringBorderWidth: Number(v),
          }))
        }
      />

      <ColorPicker
        label="Ring Border"
        value={layoutDraft.ringBorderColor}
        resetColor="var(--border)"
        onCommit={(c) =>
          setLayoutDraft((p) => ({
            ...p,
            ringBorderColor: c,
          }))
        }
      />

      <Input
        label="Polar Opacity From"
        type="range"
        value={layoutDraft.fillOpacityFrom}
        min={0}
        max={1}
        step={0.1}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            fillOpacityFrom: Number(v),
          }))
        }
      />

      <Input
        label="Polar Opacity To"
        type="range"
        value={layoutDraft.fillOpacityTo}
        min={0}
        max={1}
        step={0.1}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            fillOpacityTo: Number(v),
          }))
        }
      />

      <PolarSeries seriesDraft={seriesDraft} setSeriesDraft={setSeriesDraft} />
    </Section>
  );
}

function PolarSeries({ seriesDraft, setSeriesDraft }) {
  return seriesDraft.map((series, i) => (
    <Section title={`Series ${i + 1}`} subSection key={i}>
      {[
        { label: "Name", key: "name", placeholder: "Enter Name" },
        {
          label: "Tooltip Label",
          key: "label",
          placeholder: "Enter Label",
        },
        { label: "Value Prefix", key: "prefix", placeholder: "Enter Prefix" },
        { label: "Value Suffix", key: "suffix", placeholder: "Enter Suffix" },
      ].map(({ label, key, placeholder }) => (
        <Input
          key={key}
          label={label}
          placeholder={placeholder}
          value={series[key]}
          onCommit={(v) =>
            setSeriesDraft((prev) => {
              const next = [...prev];
              next[i] = { ...next[i], [key]: v };
              return next;
            })
          }
        />
      ))}

      <ColorPicker
        label="Color"
        value={series.color}
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
