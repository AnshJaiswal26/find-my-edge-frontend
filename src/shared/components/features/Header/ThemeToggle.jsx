import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@shared/stores";
import { Button } from "@shared/components/ui";

export const ThemeToggle = () => {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <Button.Icon onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun
          size={18}
          className="
              text-orange-400 fill-orange-400
              rounded-full
              bg-[rgba(255,246,115,0.36)]
              shadow-[0_0_16px_rgb(255,246,115)]
            "
        />
      ) : (
        <Moon
          size={18}
          className="
              text-[#667da0] fill-[#667da0]
              rounded-full
              bg-[rgba(13,23,40,0.3)]
              shadow-[0_0_20px_rgb(11,21,39)]
            "
        />
      )}
    </Button.Icon>
  );
};
