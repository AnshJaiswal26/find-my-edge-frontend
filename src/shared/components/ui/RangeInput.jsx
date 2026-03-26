import Input from "./Input/Input";

export default function RangeInput({
  refFrom,
  refTo,
  type,
  value = {},
  onChange,
}) {
  return (
    <>
      <div className="flex gap-4">
        <Input
          ref={refFrom}
          label="From"
          vertical
          placeholder="Enter from"
          type={type}
          value={value.from ?? ""}
          onChange={(parsed) => onChange({ ...value, from: parsed })}
        />

        <Input
          ref={refTo}
          label="To"
          vertical
          placeholder="Enter to"
          type={type}
          value={value.to ?? ""}
          onChange={(parsed) => onChange({ ...value, to: parsed })}
        />
      </div>
    </>
  );
}
