import { Button, PopupMessage } from "@ui";
import { useRiskManagementStore } from "@features/risk-management/stores";
import {
  useTradeSummary,
  useChargesLogic,
} from "@features/risk-management/hooks";
import { formatINR, safe } from "@features/risk-management/utils";
import { useState } from "react";
import { Section } from "@layout";

export default function ChargesSummarySection() {
  console.log("ChargesSummarySection...");

  return (
    <Section>
      <div className="flex justify-between flex-wrap">
        <div className="transaction-summary-title">Charges Summary</div>
        <div className="flex gap-2.5 align-middle">
          <label className="risk-label">Charges</label>
          <ToggleChargesButtons />
        </div>
      </div>
      <ChargesSummaryList />
    </Section>
  );
}

function ToggleChargesButtons() {
  const active = useRiskManagementStore((s) => s.anyTooltipActive);
  const charges = useChargesLogic();

  const [isAdded, setIsAdded] = useState("");

  return (
    <>
      {isAdded === "added" && (
        <PopupMessage
          message="Charges Added"
          type="success"
          duration={1200}
          isVisible={true}
          onClose={() => setIsAdded("")}
          showCloseButton={false}
        />
      )}

      {isAdded === "removed" && (
        <PopupMessage
          message="Charges Removed"
          type="success"
          duration={1200}
          isVisible={true}
          onClose={() => setIsAdded("")}
          showCloseButton={false}
        />
      )}
      <Button
        text="Add"
        color="#05ab72"
        onClick={() => {
          charges("added");
          setIsAdded("added");
        }}
        style={{
          padding: "3px 10px",
          fontSize: "12px",
          disabled: active,
        }}
      />
      <Button
        text="Remove"
        color="#fe5a5a"
        onClick={() => {
          charges("removed");
          setIsAdded("removed");
        }}
        style={{
          padding: "3px 10px",
          fontSize: "12px",
          disabled: active,
        }}
      />
    </>
  );
}

function ChargesSummaryList() {
  const { chargesSummaryList } = useTradeSummary();

  return (
    <>
      {chargesSummaryList.map((item, idx) => (
        <div className="charges-summary-row" key={idx}>
          <span className="charges-summary-label">{item.label}</span>
          <span className="charges-summary-value">
            {typeof item.value === "number"
              ? formatINR(item.value || 0)
              : item.value}
          </span>
        </div>
      ))}
    </>
  );
}
