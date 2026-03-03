import { Check } from "lucide-react";

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

export default function ConnectionBadge({ text = "Connected", size = "sm" }) {
  const { iconsize, textsize, width, height } = sizes[size] || sizes.sm;
  return (
    <div className={`flex items-center gap-2 text-(--text) mt-2 ${textsize}`}>
      <div
        className={`bg-(--success) rounded-full flex items-center justify-center ${width} ${height}`}
      >
        <Check size={iconsize} className="stroke-white stroke-5" />
      </div>
      {text}
    </div>
  );
}
