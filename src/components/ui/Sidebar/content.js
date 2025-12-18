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

export const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboardIcon, route: pageRoute.dashboard },
  {
    label: "Sheet Integration",
    icon: FileSpreadsheet,
    route: pageRoute.sheetIntegration,
  },
  { label: "Trade Metrics", icon: Table, route: pageRoute.tradeMetrics },
  { label: "Monthly Overview", icon: Calendar, route: pageRoute.calendar },
  { label: "Strategy Rules", icon: FileCheck, route: pageRoute.setupRules },
  {
    label: "Captured Strategies",
    icon: NotepadText,
    route: pageRoute.capturedStrategies,
  },
  { label: "Strategy Analysis", icon: ChartNoAxesCombined, route: null },
  { label: "Mistakes To Avoid", icon: CircleX, route: pageRoute.mistakes },
  { label: "Risk Management", icon: Scale, route: pageRoute.riskManagement },
];
