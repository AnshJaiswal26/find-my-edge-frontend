import { CalcualtorSectionLayout } from "@RM/layout";
import { useClearLogic } from "@RM/hooks";
import { Button } from "@components";

export default function PositionSizingSection() {
  const clearSection = useClearLogic();

  return (
    <CalcualtorSectionLayout
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
