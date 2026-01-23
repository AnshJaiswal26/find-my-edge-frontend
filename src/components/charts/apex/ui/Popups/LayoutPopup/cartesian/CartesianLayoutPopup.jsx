import { Button } from "@ui";
import { Section } from "@layout";

import {
  GeneralSection,
  XAxisSection,
  YAxisSection,
  BarSettingsSection,
  LineSettingsSection,
} from "./sections";
import LegendSection from "../common sections/LegendSection";

export default function CartesianLayoutPopup(props) {
  const { type, layoutDraft, setLayoutDraft, chart } = props;

  const isHorizontal = chart.layout.horizontal;

  return (
    <>
      <GeneralSection {...props} />
      <Section title="Grid">
        {[
          { title: "X Grid", key: "xGrid" },
          { title: "Y Grid", key: "yGrid" },
        ].map(({ title, key }, i) => (
          <Button.Toggle
            key={i}
            label={title}
            value={layoutDraft[key]}
            onCommit={(v) => setLayoutDraft((p) => ({ ...p, [key]: v }))}
          />
        ))}
      </Section>

      {type === "line" ? (
        <LineSettingsSection {...props} />
      ) : type === "bar" ? (
        <BarSettingsSection {...props} />
      ) : null}

      <XAxisSection {...props} isHorizontal={isHorizontal} />

      <YAxisSection {...props} isHorizontal={isHorizontal} />

      <LegendSection {...props} />
    </>
  );
}
