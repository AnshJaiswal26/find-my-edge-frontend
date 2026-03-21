import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui";

import { ToolbarSection } from "../layout";

export function Toolbar({ title }) {
  return (
    <div className="flex flex-row w-full gap-3 h-fit">
      <ToolbarSection className="flex-3 justify-between border-r border-(--border)">
        <span className="ml-3">{title}</span>
        <Button.Icon className="mr-3">
          <Pencil size={16} />
        </Button.Icon>
      </ToolbarSection>
      <ToolbarSection className="flex-4 justify-end">
        <Button.Icon>
          <Pencil size={16} />
        </Button.Icon>
        <Button.Icon>
          <Trash2 size={16} />
        </Button.Icon>
      </ToolbarSection>
    </div>
  );
}
