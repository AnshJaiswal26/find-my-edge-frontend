import { Section } from "@layout";
import { Input, Select } from "@ui";
import {
  DATE_FORMATS,
  NUMBER_FORMATS,
  TIME_FORMATS,
} from "@features/trade-metrics/table/utils";

const numberFomart = Object.values(NUMBER_FORMATS).map(({ key }) => key);

const formats = {
  number: numberFomart,
  computed: numberFomart,
  time: Object.values(TIME_FORMATS).map(({ key }) => key),
  date: Object.values(DATE_FORMATS).map(({ key }) => key),
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
