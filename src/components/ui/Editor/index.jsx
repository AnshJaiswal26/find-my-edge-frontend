import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@ui";
import { Bell, Search, Settings } from "lucide-react";
import { useUIStore } from "@stores";
import { NavbarToggle } from "./NavbarToggle";
import { ThemeToggle } from "./ThemeToggle";

const EditorLeftActions = () => {
  return (
    <div className="flex items-center gap-4">
      <NavbarToggle />

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
        <ThemeToggle />

        <IconButton
          icon={<Bell className="text-yellow-400 fill-yellow-400" />}
        />

        <IconButton
          icon={<Settings className="text-gray-400" />}
          onClick={() => navigate("/settings")}
        />
      </div>
    </div>
  );
};

export default function Editor() {
  return (
    <div
      className="
        sticky top-0 z-1000
        flex justify-between items-center
        gap-40
        w-full min-h-10 h-[min(15vh,60px)]
        p-4
        backdrop-blur-sm
        bg-(--surface-muted-soft)
        shadow-(--shadow)
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
