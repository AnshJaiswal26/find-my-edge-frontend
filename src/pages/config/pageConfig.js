import {
  LayoutDashboardIcon,
  BarChart3,
  CalendarDays,
  FileCheck,
  NotebookPen,
  CircleX,
  ChartNoAxesCombined,
  Scale,
  FileSpreadsheet,
  LineChart,
  Plug,
  Puzzle,
  Settings,
} from "lucide-react";

export const PAGE_CONFIG = {
  DASHBOARD: {
    label: "Edge Dashboard",
    route: "/",
    key : "dashboard",
    icon: LayoutDashboardIcon,
  },

  TRADE_METRICS: {
    label: "Trade Explorer",
    route: "/trade-metrics",
    key : "trade-metric",
    icon: BarChart3,
  },

  SHEET_INTEGRATION: {
    label: "Trade Import",
    route: "/sheet-integration",
    icon: FileSpreadsheet,
  },

  CALENDAR: {
    label: "Trading Calendar",
    route: "/calendar",
    icon: CalendarDays,
  },

  SETUP_RULES: {
    label: "Strategy Rules",
    route: "/setup-rules",
    icon: FileCheck,
  },

  CAPTURED_STRATEGIES: {
    label: "Captured Setups",
    route: "/captured-strategies",
    icon: NotebookPen,
  },

  STRATEGY_ANALYSIS: {
    label: "Strategy Analytics",
    route: "/strategy-analysis",
    icon: ChartNoAxesCombined,
  },

  MISTAKES: {
    label: "Mistake Tracker",
    route: "/mistakes",
    icon: CircleX,
  },

  RISK_MANAGEMENT: {
    label: "Risk Analytics",
    route: "/risk-management",
    icon: Scale,
  },

  INTEGRATIONS: {
    label: "Broker Integrations",
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
    icon: Settings,
  },
};
