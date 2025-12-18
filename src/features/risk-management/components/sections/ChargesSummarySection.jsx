import { Button } from "@ui";
import { useRiskManagementStore } from "@features/risk-management/stores";
import {
  useTradeSummary,
  useChargesLogic,
} from "@features/risk-management/hooks";
import { formatINR } from "@features/risk-management/utils";
import { Section } from "@layout";
import { useUIStore } from "@stores";
import { useRef } from "react";

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
  const showToast = useUIStore((s) => s.showToast);

  return (
    <>
      <Button
        text="Add"
        color="#05ab72"
        onClick={() => {
          charges("added");
          showToast("SUCCESS", "Charges added");
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
          showToast("ERROR", "Charges removed");
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
