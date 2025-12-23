import { Input } from "@ui";

export function MetricNameInput({ value, onChange }) {
  return (
    <Input
      label="Metric Name"
      vertical
      placeholder="eg. Used Capital"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
