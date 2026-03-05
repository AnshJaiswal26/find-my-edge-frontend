import { Check, Info, AlertTriangle, X } from "lucide-react";

const sizes = {
  sm: {
    iconsize: 15,
    textsize: "text-sm",
    width: "w-5",
    height: "h-5",
  },

  md: {
    iconsize: 20,
    textsize: "text-base",
    width: "w-7",
    height: "h-7",
  },

  lg: {
    iconsize: 25,
    textsize: "text-lg",
    width: "w-8",
    height: "h-8",
  },
};

const variants = {
  success: {
    color: "bg-(--success)",
    Icon: Check,
    text: "Success",
  },

  info: {
    color: "bg-(--info)",
    Icon: Info,
    text: "Info",
  },

  warning: {
    color: "bg-(--warning)",
    Icon: AlertTriangle,
    text: "Warning",
  },

  error: {
    color: "bg-(--error)",
    Icon: X,
    text: "Error",
  },
};

export default function ConnectionBadge({
  text,
  size = "sm",
  variant = "success",
}) {
  const { iconsize, textsize, width, height } = sizes[size] || sizes.sm;

  const config = variants[variant] || variants.info;

  const Icon = config.Icon;
  const label = text ?? config.text;

  return (
    <div className={`flex items-center gap-2 text-(--text) mt-2 ${textsize}`}>
      <div
        className={`${config.color} rounded-full flex items-center justify-center ${width} ${height}`}
      >
        <Icon size={iconsize} className="stroke-white stroke-[2.5]" />
      </div>

      {label}
    </div>
  );
}
