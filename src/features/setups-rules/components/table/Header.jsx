import { Cell } from "@features/setups-rules/components/ui";

export function Header() {
  return (
    <div
      className="sticky top-0 z-10 flex bg-(--surface)
      border border-(--border)
      divide-x divide-(--border)"
    >
      <div className="w-4.5 border-0" />
      {["Label", "Mapped Column", "Rule", "Expected", "Tag"].map((text, i) => (
        <Cell text={text} key={i} index={i} />
      ))}
    </div>
  );
}
