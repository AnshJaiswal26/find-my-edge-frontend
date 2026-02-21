import { Button, Input, Select } from "@shared/components/ui";
import { Section } from "@shared/components/layout";

export default function LineSection({ layoutDraft, setLayoutDraft }) {
  return (
    <div className="space-y-4">
      {/* ---------- Stroke ---------- */}
      <Section title="Stroke">
        <div className="space-y-6">
          <Input
            label="Stroke Width"
            type="range"
            min={1}
            max={10}
            value={layoutDraft.strokeWidth}
            onCommit={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                strokeWidth: Number(v),
              }))
            }
          />

          <Select
            vertical
            label="Stroke Type"
            options={["Straight", "Smooth", "StepLine"]}
            value={layoutDraft.curve}
            getKey={(v) => v.toLowerCase()}
            onChange={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                curve: v.toLowerCase(),
              }))
            }
          />
        </div>
      </Section>

      {/* ---------- Marker ---------- */}
      <Section title="Marker">
        <div className="space-y-6">
          <Input
            label="Marker Size"
            type="range"
            min={0}
            max={10}
            value={layoutDraft.markerSize}
            onCommit={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                markerSize: Number(v),
              }))
            }
          />

          <Input
            label="Marker Hover Size"
            type="range"
            min={1}
            max={15}
            value={layoutDraft.markerHoverSize}
            onCommit={(v) =>
              setLayoutDraft((p) => ({
                ...p,
                markerHoverSize: Number(v),
              }))
            }
          />
        </div>
      </Section>

      {/* ---------- Area ---------- */}
      <Section title="Area">
        <div className="space-y-6">
          <Button.Toggle
            value={layoutDraft.area}
            label="Show Area"
            onChange={(v) => setLayoutDraft((p) => ({ ...p, area: v }))}
          />

          {layoutDraft.area && (
            <>
              <Input
                label="Opacity From"
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
                label="Opacity To"
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
                value={layoutDraft.areaGradientHorizontal}
                label="Horizontal Gradient"
                onChange={(v) =>
                  setLayoutDraft((p) => ({
                    ...p,
                    areaGradientHorizontal: v,
                  }))
                }
              />
            </>
          )}
        </div>
      </Section>
    </div>
  );
}
