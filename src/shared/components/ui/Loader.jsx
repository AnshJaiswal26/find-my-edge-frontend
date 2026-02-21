import { Loader2 } from "lucide-react";

export default function Loader({ size = 60 }) {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 size={size} className="animate-spin" color="var(--text)" />
    </div>
  );
}
