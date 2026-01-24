import { Button } from "@ui";
import { Section } from "@layout";

export default function GridSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Grid">
      <div className="space-y-4">
        {[
          {
            key: "xGrid",
            label: "X Grid",
            hint: "Show vertical grid lines",
          },
          {
            key: "yGrid",
            label: "Y Grid",
            hint: "Show horizontal grid lines",
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
  );
}
