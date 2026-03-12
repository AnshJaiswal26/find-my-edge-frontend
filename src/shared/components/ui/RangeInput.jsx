import Input from "./Input/Input";

export default function RangeInput({ type, value = {}, onChange }) {
  return (
    <>
      <div className="flex gap-4">
        <Input
          label="From"
          vertical
          normalize
          placeholder="Enter from"
          type={type}
          value={value.from ?? 0}
          onChange={(parsed) => onChange({ ...value, from: parsed })}
        />

        <Input
          label="To"
          vertical
          placeholder="Enter to"
          normalize
          type={type}
          value={value.to ?? 0}
          onChange={(parsed) => onChange({ ...value, to: parsed })}
        />
      </div>
    </>
  );
}
