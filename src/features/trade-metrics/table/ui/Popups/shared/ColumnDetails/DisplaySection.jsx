import { Section } from "@layout";
import { Input, Select } from "@ui";
import { DEFAULT_FORMATS, FORMATS } from "@utils";

export function DisplaySection({ display, onChange, type }) {
  console.log(type);
  const semanticType = type === "text" || type === "select" ? "string" : type;
  return (
    <Section title={"Display"}>
      <Select
        label="Format"
        value={display.format || DEFAULT_FORMATS[semanticType]}
        options={FORMATS[semanticType]}
        onChange={(f) =>
          onChange((p) => ({
            ...p,
            display: { ...p?.display, format: f },
          }))
        }
      />

      {type === "number" && (
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
