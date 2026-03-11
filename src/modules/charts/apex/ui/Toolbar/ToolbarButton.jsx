import { Button } from "@shared/components/ui";

export function ToolbarButton({ icon: Icon, title, active, onClick }) {
  return (
    <Button.Icon tooltip={{ text: title, position: "left" }} onClick={onClick}>
      <Icon size={16} className={active ? "text-(--info)" : "text-(--text)"} />
    </Button.Icon>
  );
}
