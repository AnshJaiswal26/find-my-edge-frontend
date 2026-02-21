import { Section } from "@shared/components/layout";
import { SEMANTIC_TYPES } from "@lib/analytics/schema";
import { Input, Select } from "@shared/components/ui";
import { DEFAULT_FORMATS, FORMATS } from "@shared/utils";

export function DisplaySection({ display, onChange, type }) {
  return (
    <Section title={"Display"}>
      <Select
        label="Format"
        value={display.format || DEFAULT_FORMATS[type]}
        options={FORMATS[type]}
        onChange={(f) =>
          onChange((p) => ({
            ...p,
            display: { ...p?.display, format: f },
          }))
        }
      />

      {type === SEMANTIC_TYPES.NUMBER && (
        <Input
          label="Decimals"
          type="range"
          min={0}
          max={5}
          value={display.decimals}
          onChange={(v) =>
            onChange((p) => ({
              ...p,
              display: {
                ...p.display,
                decimals: Number(v),
              },
            }))
          }
        />
      )}
    </Section>
  );
}
