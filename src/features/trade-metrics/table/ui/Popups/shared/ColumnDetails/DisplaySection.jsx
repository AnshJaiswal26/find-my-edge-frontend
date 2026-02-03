import { Section } from "@layout";
import { Input, Select } from "@ui";
import { DEFAULT_FORMATS, FORMATS } from "@utils";

export function DisplaySection({ display, onChange, type }) {
  if (type === "text" || type === "select") return null;

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

      {(type === "number" || type.includes("computed")) && (
        <Input
          label="Decimals"
          type="range"
          min={0}
          max={5}
          value={display.decimals}
          onChange={(e) =>
            onChange((p) => ({
              ...p,
              display: {
                ...p.display,
                decimals: Number(e.target.value),
              },
            }))
          }
        />
      )}
    </Section>
  );
}
