import { Button } from "@shared/components/ui";
import {
  hideTooltip,
  showTooltip,
} from "@shared/components/ui/tooltip/index.js";

export function ToolbarButton({ icon: Icon, title, active, onClick }) {
  return (
    <Button.Icon
      onClick={onClick}
      onMouseEnter={(e) => showTooltip(e, { content: title, position: "left" })}
      onMouseLeave={hideTooltip}
    >
      <Icon size={16} className={active ? "text-(--info)" : "text-(--text)"} />
    </Button.Icon>
  );
}
