import { formatForInput, parseInputValue } from "@utils";
import Input from "./Input";

const getHtmlInputType = (valueType) => {
  if (valueType === "duration" || valueType === "time computed") return "text";
  return valueType;
};

export default function RangeInput({
  valueType,
  value = {},
  showStep = false,
  stepUnit = "raw",
  onChange,
}) {
  const parse = (raw) => parseInputValue(raw, valueType);
  const format = (v) => formatForInput(v, valueType);

  return (
    <>
      <Input
        label="From"
        type={valueType.replace(" computed", "")}
        valueType={valueType}
        placeholder={
          valueType === "duration" || valueType === "time computed"
            ? "HH:mm:ss"
            : undefined
        }
        step={1}
        value={format(value.from)}
        onChange={(e) => onChange({ ...value, from: parse(e.target.value) })}
      />

      <Input
        label="To"
        type={valueType.replace(" computed", "")}
        valueType={valueType}
        placeholder={
          valueType === "duration" || valueType === "time computed"
            ? "HH:mm:ss"
            : undefined
        }
        step={1}
        value={format(value.to)}
        onChange={(e) => onChange({ ...value, to: parse(e.target.value) })}
      />

      {showStep && (
        <Input
          label="Step"
          type="number"
          value={value.step ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              step: Number(e.target.value),
            })
          }
        />
      )}
    </>
  );
}
