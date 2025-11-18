import { useLocation, useNavigate } from "react-router-dom";
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
import { pageRoute } from "@data";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboardIcon, route: pageRoute.dashboard },
  { label: "Sheet Integration", icon: FileSpreadsheet, route: pageRoute.edge },
  { label: "Trade Metrics", icon: Table, route: pageRoute.tradeMetrics },
  { label: "Monthly Overview", icon: Calendar, route: pageRoute.calendar },
  { label: "Strategy Rules", icon: FileCheck, route: pageRoute.setupRules },
  {
    label: "Captured Strategies",
    icon: NotepadText,
    route: pageRoute.backtest,
  },
  { label: "Strategy Analysis", icon: ChartNoAxesCombined, route: null },
  { label: "Mistakes To Avoid", icon: CircleX, route: pageRoute.mistakes },
  { label: "Risk Management", icon: Scale, route: pageRoute.riskManagement },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <>
      <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>
      <div className={styles.sidebar}>
        <Profile />
        <div className={styles.sidebarMenu}>
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              className={`${styles.sidebarButtons} ${
                location.pathname === item.route ? styles.buttonActive : ""
              }`}
              onClick={() => item.route && navigate(item.route)}
            >
              <div className="flex items-center gap-2">
                <item.icon />
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
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
