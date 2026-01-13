import { Section } from "@layout";
import { Input, Select } from "@ui";
import {
  DATE_FORMATS,
  NUMBER_FORMATS,
  TIME_FORMATS,
  DEFAULTS_FORMATS,
} from "@table/utils";

const numberFomart = NUMBER_FORMATS.map(({ key }) => key);
const timeFormat = TIME_FORMATS.map(({ key }) => key);
const dateFormat = DATE_FORMATS.map(({ key }) => key);

const formats = {
  number: numberFomart,
  "number computed": numberFomart,
  time: timeFormat,
  date: dateFormat,
  "time computed": [timeFormat[0], timeFormat[1]],
  "date computed": dateFormat,
};

export function DisplaySection({ display, onChange, type }) {
  if (type === "text" || type === "select") return null;

  return (
    <Section title={"Display"}>
      <Select
        label="Format"
        value={display.format || DEFAULTS_FORMATS[type]}
        options={formats[type]}
        getLabel={(f) => f}
        getKey={(f) => f}
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
