import { Button } from "@ui";
import { Section } from "@layout";

import GeneralSection from "./sections/GeneralSection";
import PolarSection from "./sections/PolarSection";
import LegendSection from "../shared/LegendSection";

export default function PolarAreaLayoutPopup(props) {
  const { layoutDraft, setLayoutDraft } = props;
  return (
    <>
      <GeneralSection {...props} />
      <PolarSection {...props} />

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

      <LegendSection {...props} />
    </>
  );
}
