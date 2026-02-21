import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/components/ui";
import { Bell, Search, Settings } from "lucide-react";
import { useUIStore } from "@shared/stores";
import { NavbarToggle } from "./NavbarToggle";
import { ThemeToggle } from "./ThemeToggle";

const PageName = () => {
  const page = useUIStore((s) => s.pageName);
  return <div className="font-bold text-xl">{page}</div>;
};

const EditorLeftActions = () => {
  return (
    <div className="flex items-center gap-4">
      <NavbarToggle />
      <PageName />

      <div
        className="
          flex items-center gap-2
          px-2.5 py-1.5
          rounded-full
          border border-(--border)
        "
      >
        <Search className="w-5 h-5 stroke-gray-400" />
        <input
          type="search"
          placeholder="Search"
          className="
            outline-none bg-transparent
            text-sm
          "
        />
      </div>
    </div>
  );
};

const EditorRightActions = () => {
  const navigate = useNavigate();
  const selectedAvatar = useUIStore((s) => s.selectedAvatar);
  const username = useUIStore((s) => s.username);

  return (
    <div className="flex items-center gap-4">
      <img
        src={selectedAvatar}
        alt="Profile"
        className="w-6 h-6 rounded-full"
      />

      <strong>{username}</strong>

      <div className="flex items-center gap-2">
        <Button.Icon>
          <Bell size={18} className="text-yellow-400 fill-yellow-400" />
        </Button.Icon>
        <Button.Icon onClick={() => navigate("/settings")}>
          <Settings size={18} className="text-gray-400" />
        </Button.Icon>
      </div>
    </div>
  );
};

export default function Editor() {
  return (
    <div
      className="
        sticky top-0 z-[100]
        flex justify-between items-center
        gap-6 md:gap-10 lg:gap-20
        w-full min-h-10 h-[min(15vh,60px)]
        p-4
        backdrop-blur-md
        bg-[color-mix(in_srgb,var(--surface)_25%,transparent)]
       
        text-(--text)
        whitespace-nowrap
        overflow-x-auto overflow-y-hidden
      "
    >
      <EditorLeftActions />
      <EditorRightActions />
    </div>
  );
}
