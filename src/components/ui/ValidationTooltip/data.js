import { AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react";

export const tooltip = {
  error: {
    className: "tooltip-error",
    icon: AlertCircle,
    bgColor: "#dc2626",
    borderColor: "#ef4444",
  },
  warning: {
    className: "tooltip-warning",
    icon: AlertTriangle,
    bgColor: "#d97706",
    borderColor: "#f59e0b",
  },
  success: {
    className: "tooltip-success",
    icon: CheckCircle,
    bgColor: "#059669",
    borderColor: "#10b981",
  },
  info: {
    className: "tooltip-info",
    icon: Info,
    bgColor: "#2563eb",
    borderColor: "#3b82f6",
  },
};
