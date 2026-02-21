import { SidebarClose, SidebarOpen } from "lucide-react";
import { useUIStore } from "@shared/stores";
import { Button } from "@shared/components/ui";

export const NavbarToggle = () => {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  const Icon = isSidebarOpen ? SidebarClose : SidebarOpen;

  return (
    <Button.Icon onClick={toggleSidebar}>
      <Icon size={18} className="text-(--cyan)" />
    </Button.Icon>
  );
};
