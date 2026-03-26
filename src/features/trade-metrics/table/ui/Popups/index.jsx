import AddColumnPopup from "./AddColumn";
import ColumnSettingsPopup from "./ColumnSettings";
import FilterPopup from "./Filter";
import SortPopup from "./Sort";
import SummaryPopup from "./Summary";
import GroupByPopup from "./GroupBy";
import { useTableStore } from "@features/trade-metrics/table/store";
import { Popup } from "@shared/components/layout";
import { TradeScorePopup } from "./TradeScore";

const PopupContents = {
  "add-column": AddColumnPopup,
  "column-settings": ColumnSettingsPopup,
  filter: FilterPopup,
  sort: SortPopup,
  summary: SummaryPopup,
  group: GroupByPopup,
  "trade-score": TradeScorePopup,
};

export default function Popups() {
  const activePopup = useTableStore((s) => s.activePopup);

  if (activePopup === null) return null;

  const PopupContent = PopupContents[activePopup];

  return (
    <Popup open>
      <PopupContent />
    </Popup>
  );
}
