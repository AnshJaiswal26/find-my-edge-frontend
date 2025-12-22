import { Input } from "@ui";

export function MetricNameInput({ value, onChange }) {
  return (
    <Input>
      <Input.Label>Metric Name</Input.Label>
      <Input.Field
        size="lg"
        className="max-w-full"
        placeholder="eg. Used Capital"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Input>
  );
}
