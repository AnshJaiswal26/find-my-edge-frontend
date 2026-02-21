import { Container } from "@shared/components/layout";
import CalculatorSection from "../sections/CalculatorSection";
import { useFormatterLogic } from "@features/risk-management/hooks";
import { Button } from "@shared/components/ui";
import { PositionSizingSection } from "..";

export function NormalCalculatorContainer() {
  return (
    <>
      <FormatButton />
      <CalculatorSection sectionName="calculator" />
      <PositionSizingSection />
    </>
  );
}

function FormatButton() {
  const { format, mode } = useFormatterLogic();

  return (
    <Button
      text="Format"
      title={"Current Mode : " + mode}
      color="#e8bd3eff"
      onClick={format}
      style={{
        padding: "5px 10px",
        fontSize: "12px",
      }}
    />
  );
}
