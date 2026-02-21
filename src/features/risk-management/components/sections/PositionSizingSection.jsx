import { CalculatorSectionLayout } from "@features/risk-management/layout";
import { useClearLogic } from "@features/risk-management/hooks";
import { Button } from "@shared/components/ui";

export default function PositionSizingSection() {
  const clearSection = useClearLogic();

  return (
    <CalculatorSectionLayout
      section={"positionSizing"}
      footerElement={
        <div className="footer-buttons">
          <Button
            text="Clear All"
            color="#fe5a5a"
            onClick={() => clearSection("positionSizing")}
            style={{
              padding: "3px 10px",
              fontSize: "12px",
            }}
          />
        </div>
      }
    />
  );
}
