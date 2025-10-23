import React from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@stores";
import styles from "./Sidebar.module.css";
import {
  LayoutDashboardIcon,
  Table,
  Calendar,
  FileCheck,
  NotepadText,
  CircleX,
  ChartNoAxesCombined,
  Scale,
  FileSpreadsheet,
} from "lucide-react";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    alt: "Dashboard",
    route: "/",
    key: "dashboard",
  },
  {
    label: "Sheet Integration",
    icon: FileSpreadsheet,
    alt: "Find Your Edge",
    route: "/edge",
    key: "edge",
  },
  {
    label: "Trade Metrics",
    icon: Table,
    alt: "Find Your Edge",
    route: "/edge",
    key: "trademetrics",
  },
  {
    label: "Monthly Overview",
    icon: Calendar,
    alt: "Month Records",
    route: "/yearly-calendar",
    key: "yearlycalender",
  },
  {
    label: "Strategy Rules",
    icon: FileCheck,
    alt: "Setup Rules",
    route: "/setup-rules",
    key: "setuprules",
  },
  {
    label: "Captured Strategies",
    icon: NotepadText,
    alt: "Back-Tested Data",
    route: "/backtest",
    key: "backtest",
  },

  {
    label: "Strategy Analysis",
    icon: ChartNoAxesCombined,
    alt: "Strategy Analysis",
    route: null,
    key: "strategyanalysis",
  },

  {
    label: "Mistakes To Avoid",
    icon: CircleX,
    alt: "Mistakes To Avoid",
    route: "/mistakes",
    key: "mistakes",
  },
  {
    label: "Risk Management",
    icon: Scale,
    alt: "Risk Management",
    route: "/risk-management",
    key: "riskmanagement",
  },
];

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
              <item.icon />
              {/* <img className="w-7" src={item.icon} alt={item.alt} /> */}
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
