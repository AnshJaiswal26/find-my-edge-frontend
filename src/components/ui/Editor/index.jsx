import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@ui";
import { Bell, Search, Settings } from "lucide-react";
import { useUIStore } from "@stores";
import { SidebarToggleButton, ThemeButton } from "./Components";
import styles from "./Editor.module.css";

export default function Editor() {
  return (
    <div className={styles.editor}>
      <EditorLeftActions />
      <EditorRightActions />
    </div>
  );
}

function EditorLeftActions() {
  return (
    <div className="flex gap-4 items-center">
      <SidebarToggleButton />
      <div className={styles.searchBar}>
        <Search />
        <input placeholder="Search" type="search" />
      </div>
    </div>
  );
}

function EditorRightActions() {
  const navigate = useNavigate();
  const selectedAvatar = useUIStore((s) => s.selectedAvatar);
  const username = useUIStore((s) => s.username);

  return (
    <div className="flex items-center gap-4">
      <img src={selectedAvatar} alt="Profile" className="w-6 h-6" />
      <div>
        <strong>{username}</strong>
      </div>

      <div className="flex gap-2">
        <ThemeButton />
        <IconButton
          icon={<Bell color="#ffd000" fill="#ffd000" />}
          src="Icons/others/bell2.png"
        />
        <IconButton
          icon={<Settings color="gray" />}
          src="Icons/others/settings.png"
          onClick={() => navigate("/settings")}
        />
      </div>
    </div>
  );
}
