import React from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@stores";
import { sidebarItems } from "./data";
import styles from "./Sidebar.module.css";

export default function Sidebar({ pageActive }) {
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <Profile />
      <div className={styles.sidebarMenu}>
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            className={`${styles.sidebarButtons} ${
              pageActive === item.key ? styles.buttonActive : ""
            }`}
            onClick={() => item.route && navigate(item.route)}
          >
            <div className="flex items-center gap-2">
              <img className="w-7" src={item.icon} alt={item.alt} />
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const selectedAvatar = useUIStore((s) => s.selectedAvatar);
  const username = useUIStore((s) => s.username);

  return (
    <div className={styles.sidebarProfile}>
      <img src={selectedAvatar} alt="Profile" className={styles.profileIcon} />
      <h3>{username} </h3>
    </div>
  );
}
