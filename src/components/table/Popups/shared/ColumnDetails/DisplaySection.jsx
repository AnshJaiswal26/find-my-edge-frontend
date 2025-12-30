import { Section } from "@layout";
import { Input, Select } from "@ui";

const formats = {
  number: [
    { key: "currency", value: "Currency" },
    { key: "ratio", value: "Ratio" },
    { key: "percent", value: "Percent" },
    { key: "custom", value: "Custom" },
  ],
  computed: [
    { key: "currency", value: "Currency" },
    { key: "ratio", value: "Ratio" },
    { key: "percent", value: "Percent" },
    { key: "custom", value: "Custom" },
  ],
  time: ["HH:MM", "HH:MM:SS", "HH:MM:SS PM/AM"],
  date: ["YYYY/MM/DD", "DD/MM/YYYY", "DD/mmm/YYYY"],
};

export function DisplaySection({ display, onChange, type }) {
  if (type === "text" || type === "select") return null;

  return (
    <Section title={"Display"}>
      <Select
        label="Format"
        value={display.format}
        options={formats[type]}
        getLabel={(ob) => ob?.value || ob}
        getKey={(ob) => ob?.key || ob}
        onChange={(ob) =>
          onChange((p) => ({
            ...p,
            display: { ...p?.display, format: ob?.key || ob },
          }))
        }
      />

      {type === "number" ||
        (type === "computed" && (
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
        ))}

      {display?.format === "custom" && (
        <div className="flex justify-between">
          <Input
            vertical
            label="Prefix"
            placeholder="Enter Prefix"
            value={display.prefix}
            onChange={(e) =>
              onChange({
                display: { ...display, prefix: e.target.value },
              })
            }
          />
          <Input
            vertical
            label="Suffix"
            placeholder="Enter Suffix"
            value={display.suffix}
            onChange={(e) =>
              onChange({
                display: { ...display, suffix: e.target.value },
              })
            }
          />
        </div>
      )}
    </Section>
  );
}
