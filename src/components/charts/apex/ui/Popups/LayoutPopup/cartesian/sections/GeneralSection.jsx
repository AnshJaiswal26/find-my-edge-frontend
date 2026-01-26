import { Input, Button } from "@ui";
import { Divider, Section } from "@layout";

export default function GeneralSection({ layoutDraft, setLayoutDraft }) {
  return (
    <div className="space-y-4">
      {/* ---------- Identity ---------- */}
      <Section title={"Identity"}>
        <Input
          classNames={{ input: "max-w-full!" }}
          vertical
          label="Title"
          type="text"
          value={layoutDraft.title}
          onCommit={(v) => setLayoutDraft((p) => ({ ...p, title: v }))}
          placeholder="e.g. Equity Curve"
        />
      </Section>
      {/* ---------- Behavior ---------- */}
      <Section title={"Interaction"}>
        <div className="space-y-4">
          {[
            {
              key: "tooltip",
              label: "Tooltip",
              hint: "Show values on hover",
            },
            {
              key: "dataLabels",
              label: "Data Labels",
              hint: "Display values on chart",
            },
            {
              key: "selection",
              label: "Selection",
              hint: "Enable point selection",
            },
          ].map(({ key, label, hint }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm">{label}</div>
                <div className="text-xs text-(--text-disabled)">{hint}</div>
              </div>

              <Button.Toggle
                value={layoutDraft[key]}
                onCommit={(v) => setLayoutDraft((p) => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
