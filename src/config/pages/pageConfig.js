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
  ChartCandlestick,
  Plug,
  Puzzle,
} from "lucide-react";

export const PAGE_CONFIG = {
  DASHBOARD: {
    label: "Dashboard",
    route: "/",
    icon: LayoutDashboardIcon,
  },

  TRADE_METRICS: {
    label: "Trade Metrics",
    route: "/trade-metrics",
    icon: Table,
  },

  SHEET_INTEGRATION: {
    label: "Sheet Integration",
    route: "/sheet-integration",
    icon: FileSpreadsheet,
  },

  CALENDAR: {
    label: "Monthly Overview",
    route: "/calendar",
    icon: Calendar,
  },

  SETUP_RULES: {
    label: "Strategy Rules",
    route: "/setup-rules",
    icon: FileCheck,
  },

  CAPTURED_STRATEGIES: {
    label: "Captured Strategies",
    route: "/captured-strategies",
    icon: NotepadText,
  },

  STRATEGY_ANALYSIS: {
    label: "Strategy Analysis",
    route: "/setup-rules",
    icon: ChartNoAxesCombined,
  },

  MISTAKES: {
    label: "Mistakes To Avoid",
    route: "/mistakes",
    icon: CircleX,
  },

  RISK_MANAGEMENT: {
    label: "Risk Management",
    route: "/risk-management",
    icon: Scale,
  },

  INTEGRATIONS: {
    label: "Integrations",
    route: "/integrations",
    icon: Plug,
  },

  EXTENSIONS: {
    label: "Extensions",
    route: "/extensions",
    icon: Puzzle,
  },

  SETTINGS: {
    label: "Settings",
    route: "/settings",
    icon: ChartCandlestick,
  },
};
