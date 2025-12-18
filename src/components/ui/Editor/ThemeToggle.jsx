import { Moon, Sun } from "lucide-react";
import { IconButton } from "../Buttons";
import { useUIStore } from "@stores";

export const ThemeToggle = () => {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <IconButton
      onClick={toggleTheme}
      icon={
        theme === "dark" ? (
          <Sun
            size={24}
            className="
              text-orange-400 fill-orange-400
              rounded-full
              bg-[rgba(255,246,115,0.36)]
              shadow-[0_0_16px_rgb(255,246,115)]
            "
          />
        ) : (
          <Moon
            size={22}
            className="
              text-[#667da0] fill-[#667da0]
              rounded-full
              bg-[rgba(13,23,40,0.3)]
              shadow-[0_0_20px_rgb(11,21,39)]
            "
          />
        )
      }
    />
  );
};
