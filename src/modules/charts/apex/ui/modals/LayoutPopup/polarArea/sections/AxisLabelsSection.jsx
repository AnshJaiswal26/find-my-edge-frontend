import { Button } from "@shared/components/ui";
import { Section } from "@shared/components/layout";

function AxisLabelsSection({ layoutDraft, setLayoutDraft }) {
  return (
    <Section title="Axis Labels">
      <Button.Toggle
        label="Y Axis Labels"
        value={layoutDraft.showYAxisLabels}
        onChange={(v) =>
          setLayoutDraft((p) => ({
            ...p,
            showYAxisLabels: v,
          }))
        }
      />
    </Section>
  );
}

export default AxisLabelsSection;
