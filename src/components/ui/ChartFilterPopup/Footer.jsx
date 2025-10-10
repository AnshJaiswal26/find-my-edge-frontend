import { Button } from "../Buttons";

export default function Footer({ onClear, onApply }) {
  return (
    <footer className="flex-box justify-end gap-2">
      <Button
        text={"Clear"}
        color={"var(--color-bg-hover)"}
        className={"text-[var(--color-text-headings)]"}
        size="small"
        onClick={onClear}
      />
      <Button text={"Apply"} size="small" onClick={onApply} />
    </footer>
  );
}
