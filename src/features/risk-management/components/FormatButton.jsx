import { useFormatterLogic } from "../hooks";
import { Button } from "@shared/components/ui";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";
import { RemoveFormatting } from "lucide-react";

export function FormatButton() {
  const { format, mode } = useFormatterLogic();

  return (
    <Button.Icon
      onClick={format}
      onMouseEnter={(e) =>
        showTooltip(e, { content: `Format (Current Mode: ${mode})` })
      }
      onMouseLeave={hideTooltip}
    >
      <RemoveFormatting size={16} />
    </Button.Icon>
  );
}
