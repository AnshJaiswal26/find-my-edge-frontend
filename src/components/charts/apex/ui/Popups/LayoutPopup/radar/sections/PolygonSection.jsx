import { Section } from "@layout";
import { ColorPicker, Input } from "@ui";

export default function PolygonSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
  setSeriesDraft,
}) {
  return (
    <Section title="Polygon">
      <Input
        label="Stroke Width"
        type="range"
        value={layoutDraft.polygonStrokeWidth}
        min={1}
        max={10}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            polygonStrokeWidth: Number(v),
          }))
        }
      />

      <Input
        label="Opacity"
        type="range"
        value={layoutDraft.radarOpacity}
        min={0}
        max={1}
        step={0.1}
        onCommit={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            radarOpacity: Number(v),
          }))
        }
      />

      <div className="flex gap-3">
        <ColorPicker
          label="Stroke"
          value={layoutDraft.polygonStroke}
          onCommit={(c) => setLayoutDraft((p) => ({ ...p, polygonStroke: c }))}
        />

        <ColorPicker
          label="Fill"
          value={layoutDraft.polygonFill}
          onCommit={(c) => setLayoutDraft((p) => ({ ...p, polygonFill: c }))}
        />
      </div>

      <RadarSeries seriesDraft={seriesDraft} setSeriesDraft={setSeriesDraft} />
    </Section>
  );
}

function RadarSeries({ seriesDraft, setSeriesDraft }) {
  return seriesDraft.map((series, i) => (
    <Section title={`Series ${i + 1}`} subSection key={i}>
      {[
        { label: "Name", key: "name", placeholder: "Enter Name" },
        {
          label: "Tooltip Label",
          key: "tooltipLabel",
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
