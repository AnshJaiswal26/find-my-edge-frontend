import { useRef, useState } from "react";
import { IconButton } from "../Buttons";
import { Filter } from "lucide-react";
import FilterPopup from "./FilterPopup";
import { useClickOutside } from "@hooks";

export default function ChartFilterPopup({ chartId }) {
  const [showFilter, setShowFilter] = useState(false);
  const ref = useRef();

  useClickOutside(ref, () => setShowFilter(false));

  return (
    <div ref={ref} className="relative">
      <IconButton
        className={"rounded-none"}
        icon={<Filter size={15} />}
        tooltip={{ title: "Filter", position: "top" }}
        onClick={() => setShowFilter((p) => !p)}
      />

      {showFilter && (
        <FilterPopup chartId={chartId} setShowFilter={setShowFilter} />
      )}
    </div>
  );
}
