import {
  Filter,
  FilterX,
  Moon,
  SidebarClose,
  SidebarOpen,
  Sun,
} from "lucide-react";
import { IconButton } from "@ui";
import { useUIStore } from "@stores";
import styles from "./Editor.module.css";

export const ThemeButton = () => {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <IconButton
      icon={
        theme === "dark" ? (
          <Sun size={24} className={styles.sunIcon} />
        ) : (
          <Moon size={22} className={styles.moonIcon} />
        )
      }
      src="Icons/others/themes.png"
      onClick={toggleTheme}
    />
  );
};

export const FliterButton = () => {
  const isFilterApplied = true;

  return (
    <IconButton
      icon={
        <div className="flex gap-2 items-center invert-on-theme">
          {isFilterApplied ? (
            <FilterX className="invert-on-theme" size={20} />
          ) : (
            <Filter className="invert-on-theme" size={20} />
          )}
          <div>
            <strong>Apply Filters</strong>
          </div>
        </div>
      }
    />
  );
};

export const SidebarToggleButton = () => {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  return (
    <IconButton
      icon={
        isSidebarOpen ? (
          <SidebarClose color="var(--color-cyan)" />
        ) : (
          <SidebarOpen color="var(--color-cyan)" />
        )
      }
      src="Icons/others/menus.png"
      onClick={toggleSidebar}
    />
  );
};
