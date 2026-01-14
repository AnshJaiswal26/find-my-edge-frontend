import { ColorPicker, Input, Select, Button } from "@ui";
import { Section } from "@layout";
import { parseColor } from "@utils";

export default function LineSettingsSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
  setSeriesDraft,
}) {
  return (
    <>
      <DataSeries seriesDraft={seriesDraft} setSeriesDraft={setSeriesDraft} />

      {/* Stroke Settings */}
      <Section title="Stroke">
        <Input
          label="Stroke Width"
          type="range"
          value={layoutDraft.strokeWidth}
          min={1}
          max={10}
          onCommit={(v) =>
            setLayoutDraft((p) => ({ ...p, strokeWidth: Number(v) }))
          }
        />

        <Select
          label="Stroke Type"
          options={["Straight", "Smooth", "StepLine"]}
          value={layoutDraft.curve}
          getKey={(v) => v.toLowerCase()}
          onChange={(v) =>
            setLayoutDraft((p) => ({ ...p, curve: v.toLowerCase() }))
          }
        />

        <SeriesColors
          title="Stroke"
          type="color"
          seriesDraft={seriesDraft}
          setSeriesDraft={setSeriesDraft}
        />
      </Section>

      {/* Marker Settings */}
      <Section title="Marker">
        <Input
          label="Marker Size"
          type="range"
          min={0}
          max={10}
          value={layoutDraft.markerSize}
          onCommit={(v) =>
            setLayoutDraft((p) => ({ ...p, markerSize: Number(v) }))
          }
        />

        <Input
          label="Marker Hover Size"
          type="range"
          min={1}
          max={15}
          value={layoutDraft.markerHoverSize}
          onCommit={(v) =>
            setLayoutDraft((p) => ({ ...p, markerHoverSize: Number(v) }))
          }
        />

        <SeriesColors
          title="Marker"
          seriesDraft={seriesDraft}
          setSeriesDraft={setSeriesDraft}
        />
      </Section>

      <AreaSettingsSection
        layoutDraft={layoutDraft}
        setLayoutDraft={setLayoutDraft}
        seriesDraft={seriesDraft}
        setSeriesDraft={setSeriesDraft}
      />
    </>
  );
}

function AreaSettingsSection({
  layoutDraft,
  setLayoutDraft,
  seriesDraft,
  setSeriesDraft,
}) {
  const isAreaVisible = layoutDraft.area;

  return (
    <Section title="Area">
      <Button.Toggle
        label="Show Area"
        value={layoutDraft.area}
        onChange={(v) => setLayoutDraft((p) => ({ ...p, area: v }))}
      />

      {isAreaVisible && (
        <>
          <Input
            label="Area Opacity From"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={layoutDraft.areaOpacityFrom}
            onCommit={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                areaOpacityFrom: Number(v),
              }))
            }
          />

          <Input
            label="Area Opacity To"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={layoutDraft.areaOpacityTo}
            onCommit={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                areaOpacityTo: Number(v),
              }))
            }
          />

          <Button.Toggle
            label="Area Horizontal"
            value={layoutDraft.areaGradientHorizontal}
            onChange={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                areaGradientHorizontal: v,
              }))
            }
          />

          <SeriesColors
            title="Area"
            type="areaColor"
            seriesDraft={seriesDraft}
            setSeriesDraft={setSeriesDraft}
          />
        </>
      )}
    </Section>
  );
}

function SeriesColors({
  title,
  type = "markerColor",
  seriesDraft,
  setSeriesDraft,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {seriesDraft.map((s, index) => (
        <ColorPicker
          key={index}
          label={`${title} ${index + 1}`}
          value={parseColor(s[type])}
          onCommit={(c) =>
            setSeriesDraft((prev) => {
              const next = [...prev];
              next[index] = { ...next[index], [type]: c };
              return next;
            })
          }
        />
      ))}
    </div>
  );
}

function DataSeries({ seriesDraft, setSeriesDraft }) {
  return (
    <Section title="Data Series Name">
      {seriesDraft.map((s, index) => (
        <Section title={`Series ${index + 1}`} key={index} subSection>
          <Input
            label="Name"
            placeholder="Enter Name"
            value={s.name}
            onCommit={(v) =>
              setSeriesDraft((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], name: v };
                return next;
              })
            }
          />

          <Input
            label="Tooltip Label"
            placeholder="Enter Label"
            value={s.tooltipLabel}
            onCommit={(v) =>
              setSeriesDraft((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], tooltipLabel: v };
                return next;
              })
            }
          />
        </Section>
      ))}
    </Section>
  );
}
