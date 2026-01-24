import { Button, Input } from "@ui";
import { Section } from "@layout";

export default function BarSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Bar">
      <div className="space-y-6">
        {[
          {
            key: "horizontal",
            label: "Horizontal",
            hint: "Render bars horizontally",
          },
          {
            key: "stacked",
            label: "Stacked",
            hint: "Stack multiple series",
          },
          {
            key: "stacked100",
            label: "Stacked 100%",
            hint: "Normalize stacked bars to 100%",
          },
        ].map(({ key, label, hint }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm">{label}</div>
              <div className="text-xs text-(--text-disabled)">{hint}</div>
            </div>

            <Button.Toggle
              value={layoutDraft[key]}
              onChange={(v) =>
                setLayoutDraft((prev) => {
                  const next = { ...prev, [key]: v };

                  if (key === "stacked100") next.stacked = v;
                  if (key === "stacked" && prev.stacked100)
                    next.stacked100 = false;

                  return next;
                })
              }
            />
          </div>
        ))}

        <Input
          label="Bar Radius"
          type="range"
          min={0}
          max={10}
          value={layoutDraft.barRadius}
          onCommit={(v) =>
            setLayoutDraft((p) => ({
              ...p,
              barRadius: Number(v),
            }))
          }
        />
      </div>
    </Section>
  );
}
