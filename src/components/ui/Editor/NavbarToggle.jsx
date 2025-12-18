import { SidebarClose, SidebarOpen } from "lucide-react";
import { IconButton } from "@ui";
import { useUIStore } from "@stores";

export const NavbarToggle = () => {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  return (
    <IconButton
      onClick={toggleSidebar}
      icon={
        isSidebarOpen ? (
          <SidebarClose className="text-(--cyan)" />
        ) : (
          <SidebarOpen className="text-(--cyan)" />
        )
      }
    />
  );
};
