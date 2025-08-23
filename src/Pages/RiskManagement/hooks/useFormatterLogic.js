import { useCallback } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { usePtsAmountAndPercentHandler } from ".";
import { formatValue, logResult, logStart } from "@RM/utils";
import { shouldFormat } from "@RM/utils";

export default function useFormatterLogic() {
  const updateSections = useRiskManagementStore((s) => s.updater.sections);
  const handlePtsAmountAndPercentChange = usePtsAmountAndPercentHandler();

  const formatAndUpdate = useCallback(
    (sec, formatedKeys, mode, state) => {
      logStart("formatAndUpdate", { sec, formatedKeys, mode });
      const { name, buyPrice, sellPrice, qty, pts } = sec;

      if (mode === "Approx") {
        logResult("formatAndUpdate", `formating done for ${name}`);
        return [["calculator", name, formatedKeys]];
      }

      const section = handlePtsAmountAndPercentChange({
        section: {
          name,
          buyPrice: formatValue(buyPrice, { mode }),
          sellPrice: formatValue(sellPrice, { mode }),
          qty,
        },
        field: "pts",
        val: formatValue(pts, { mode }),
        isFormatting: true,
        state,
      });

      logResult("formatAndUpdate", `formating done for ${name}`);
      return section;
    },
    [handlePtsAmountAndPercentChange]
  );

  const format = useCallback(() => {
    const state = useRiskManagementStore.getState();
    const { settings, currentTab } = state;
    const sectionArray =
      currentTab === "normal" ? ["calculator"] : ["target", "stopLoss"];
    const mode = settings.roundMode;

    const sectionUpdates = [];
    sectionArray.forEach((s) => {
      const sec = state[s];
      const formatedKeys = shouldFormat(sec, mode);
      if (formatedKeys) {
        const updates = formatAndUpdate(sec, formatedKeys, mode, state);
        sectionUpdates.push(...updates);
      }
    });
    updateSections(sectionUpdates);
  }, [formatAndUpdate, updateSections]);

  return { format };
}
