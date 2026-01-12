import AddColumnPopup from "./AddColumn";
import ColumnSettingsPopup from "./ColumnSettings";
import FilterPopup from "./Filter";
import SortPopup from "./Sort";
import SummaryPopup from "./Summary";
import GroupByPopup from "./GroupBy";
import { useTableStore } from "../../store/useTableStore";

export default function Popups() {
  const activePopup = useTableStore((s) => s.activePopup);

  if (activePopup === null) return null;

  switch (activePopup) {
    case "add-column":
      return <AddColumnPopup />;

    case "column-settings":
      return <ColumnSettingsPopup />;

    case "filter":
      return <FilterPopup />;

    case "sort":
      return <SortPopup />;

    case "summary":
      return <SummaryPopup />;

    case "group":
      return <GroupByPopup />;

    default:
      return null;
  }
}
