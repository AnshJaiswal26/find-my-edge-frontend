import { Button } from "@ui";
import { useRiskManagementStore } from "@features/risk-management/stores";
import {
  useTradeSummary,
  useChargesLogic,
} from "@features/risk-management/hooks";
import { formatINR, safe } from "@features/risk-management/utils";

export default function ChargesSummarySection() {
  console.log("ChargesSummarySection...");

  return (
    <div className="charges-summary">
      <div className="flex justify-between flex-wrap">
        <div className="transaction-summary-title">Charges Summary</div>
        <div className="flex gap-2.5 align-middle">
          <label className="risk-label">Charges</label>
          <ToggleChargesButtons />
        </div>
      </div>
      <ChargesSummaryList />
    </div>
  );
}

function ToggleChargesButtons() {
  const active = useRiskManagementStore((s) => s.anyTooltipActive);
  const charges = useChargesLogic();

  return (
    <>
      <Button
        text="Add"
        color="#05ab72"
        onClick={() => charges("added")}
        style={{
          padding: "3px 10px",
          fontSize: "12px",
          disabled: active,
        }}
      />
      <Button
        text="Remove"
        color="#fe5a5a"
        onClick={() => charges("removed")}
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
  const { breakevenPts, tradeVal, charges } = useTradeSummary();

  const chargesSummaryList = [
    { label: "Turnover", value: Math.ceil(tradeVal) },
    { label: "Brokerage", value: charges.brokerage },
    { label: "Exchange Transaction Charges", value: charges.eT },
    { label: "DP Charges", value: charges.dp },
    { label: "Securities Transaction Tax STT", value: charges.stt },
    { label: "SEBI Turnover Charges", value: charges.sebi },
    { label: "Investor Protection Fund Trust IPFT", value: charges.ipft },
    { label: "Stamp Duty", value: charges.stampDuty },
    { label: "GST", value: charges.gst },
    { label: "Total Tax & Charges", value: charges.total },
    {
      label: "Points to Breakeven (No Profit No Loss)",
      value: "+" + safe(breakevenPts, 2),
    },
  ];
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
