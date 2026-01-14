import { Button, ColorPicker, Input } from "@ui";
import { Section } from "@layout";
import { parseColor } from "@utils";
import { Trash2 } from "lucide-react";

export default function BarSettingsSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
  setSeriesDraft,
}) {
  return (
    <Section title="Bar Settings">
      {[
        { title: "Horizontal", key: "horizontal" },
        { title: "Stacked", key: "stacked" },
        { title: "Stacked 100%", key: "stacked100" },
      ].map(({ title, key }) => (
        <Button.Toggle
          key={key}
          label={title}
          value={layoutDraft[key]}
          onChange={(v) =>
            setLayoutDraft((p) => {
              const next = { ...p, [key]: v };

              if (key === "stacked100") next.stacked = v;
              if (key === "stacked" && p.stacked100) next.stacked100 = false;

              return next;
            })
          }
        />
      ))}

      <Input
        label="Bar Radius"
        type="range"
        min={0}
        max={10}
        value={layoutDraft.barRadius}
        onCommit={(v) =>
          setLayoutDraft((p) => ({ ...p, barRadius: Number(v) }))
        }
      />

      <ConditionalColorRange
        seriesDraft={seriesDraft}
        setSeriesDraft={setSeriesDraft}
      />
    </Section>
  );
}

function ConditionalColorRange({ seriesDraft, setSeriesDraft }) {
  return (
    <>
      {seriesDraft.map((_, index) => (
        <ConditionalBarColor
          key={index}
          seriesIndex={index}
          seriesDraft={seriesDraft}
          setSeriesDraft={setSeriesDraft}
        />
      ))}
    </>
  );
}

function ConditionalBarColor({ seriesIndex, seriesDraft, setSeriesDraft }) {
  const series = seriesDraft[seriesIndex];
  const colors = series.colors || [];

  if (colors.length === 0) return null;

  return (
    <Section title={`Series ${seriesIndex + 1}`}>
      <Input
        label="Series Name"
        value={series.name}
        onCommit={(v) =>
          setSeriesDraft((prev) => {
            const next = [...prev];
            next[seriesIndex] = { ...next[seriesIndex], name: v };
            return next;
          })
        }
      />

      {colors.map((color, index) => (
        <Section key={index} subSection title={`Range ${index + 1}`}>
          {[
            { key: "from", label: "From", type: "number" },
            { key: "to", label: "To", type: "number" },
            { key: "tooltipLabel", label: "Tooltip Label", type: "text" },
          ].map(({ key, label, type }) => (
            <Input
              key={key}
              label={label}
              type={type}
              value={color[key]}
              onCommit={(v) =>
                setSeriesDraft((prev) => {
                  const next = [...prev];
                  const updated = [...next[seriesIndex].colors];
                  updated[index] = {
                    ...updated[index],
                    [key]: type === "number" ? Number(v) : v,
                  };
                  next[seriesIndex] = {
                    ...next[seriesIndex],
                    colors: updated,
                  };
                  return next;
                })
              }
            />
          ))}

          <div className="flex justify-between">
            <ColorPicker
              label="Color"
              value={parseColor(color.color)}
              onCommit={(c) =>
                setSeriesDraft((prev) => {
                  const next = [...prev];
                  const updated = [...next[seriesIndex].colors];
                  updated[index] = { ...updated[index], color: c };
                  next[seriesIndex] = {
                    ...next[seriesIndex],
                    colors: updated,
                  };
                  return next;
                })
              }
            />

            <Button.Icon
              onClick={() =>
                setSeriesDraft((prev) => {
                  const next = [...prev];
                  next[seriesIndex] = {
                    ...next[seriesIndex],
                    colors: next[seriesIndex].colors.filter(
                      (_, i) => i !== index
                    ),
                  };
                  return next;
                })
              }
            >
              <Trash2 size={16} />
            </Button.Icon>
          </div>
        </Section>
      ))}

      <div className="flex justify-end">
        <Button
          text="Add"
          size="medium"
          onClick={() =>
            setSeriesDraft((prev) => {
              const next = [...prev];
              next[seriesIndex] = {
                ...next[seriesIndex],
                colors: [
                  ...next[seriesIndex].colors,
                  {
                    from: 0,
                    to: 0,
                    color: "var(--info)",
                    tooltipLabel: "",
                  },
                ],
              };
              return next;
            })
          }
        />
      </div>
    </Section>
  );
}
