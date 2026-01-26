import Input from "./Input/Input";

export default function RangeInput({
  type,
  value = {},
  showStep = false,
  onChange,
}) {
  return (
    <>
      <div className="flex gap-4">
        <Input
          label="From"
          vertical
          normalize
          placeholder="Enter from"
          type={type}
          value={value.from}
          onChange={(e, parsed) => onChange({ ...value, from: parsed })}
        />

        <Input
          label="To"
          vertical
          placeholder="Enter to"
          normalize
          type={type}
          value={value.to}
          onChange={(e, parsed) => onChange({ ...value, to: parsed })}
        />
        {showStep && (
          <Input
            label="Step"
            vertical
            placeholder="Enter Number"
            type="number"
            value={value.step ?? 0}
            onChange={(e) =>
              onChange({
                ...value,
                step: Number(e.target.value),
              })
            }
          />
        )}
      </div>
    </>
  );
}
