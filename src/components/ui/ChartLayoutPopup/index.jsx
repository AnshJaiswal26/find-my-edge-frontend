import { useRef, useState } from "react";
import { IconButton } from "../Buttons";
import { Settings2 } from "lucide-react";
import { ChartPopup } from "@layout";
import { useClickOutside } from "@hooks";

export default function ChartLayoutPopup({ chartId }) {
  const [showLayoutPopup, setShowLayoutPopup] = useState(false);
  const ref = useRef();

  //   useClickOutside(ref, () => setShowLayoutPopup(false));

  return (
    <div ref={ref} className="relative">
      <IconButton
        className={"rounded-none"}
        icon={<Settings2 size={15} />}
        tooltip={{ title: "Layout", position: "bottom" }}
        onClick={() => setShowLayoutPopup((p) => !p)}
      />

      <ChartPopup
        title={"Layout"}
        isVisible={showLayoutPopup}
        text={{ leftBtn: "Cancel", rightBtn: "Apply" }}
      ></ChartPopup>
    </div>
  );
}
