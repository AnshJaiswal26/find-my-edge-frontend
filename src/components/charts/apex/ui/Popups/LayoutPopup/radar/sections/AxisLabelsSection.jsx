import { Section } from "@layout";
import { Button, Input } from "@ui";

export default function AxisLabelsSection({
  layoutDraft,
  seriesDraft,
  setLayoutDraft,
  setSeriesDraft,
}) {
  return (
    <Section title="Axis Labels">
      <Button.Toggle
        label="X Axis Labels"
        value={layoutDraft.showXAxisLabels}
        onChange={(v) => setLayoutDraft((p) => ({ ...p, showXAxisLabels: v }))}
      />

      <Button.Toggle
        label="Y Axis Labels"
        value={layoutDraft.showYAxisLabels}
        onChange={(v) => setLayoutDraft((p) => ({ ...p, showYAxisLabels: v }))}
      />

      <AxisLabels seriesDraft={seriesDraft} setSeriesDraft={setSeriesDraft} />
    </Section>
  );
}

function AxisLabels({ seriesDraft, setSeriesDraft }) {
  return seriesDraft.map((series, i) => (
    <Input
      key={i}
      label={`Axis ${i + 1}`}
      value={series.axis}
      placeholder="Enter Axis Label"
      onCommit={(v) =>
        setSeriesDraft((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], axis: v };
          return next;
        })
      }
    />
  ));
}
