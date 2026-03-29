import { FormatButton } from "./FormatButton";
import { CalculatorSectionLayout } from "../layout";
import { ResetInputsButton } from "./ResetInputsButton";
import { Calculator } from "./Calculator";

export function NormalCalculator() {
  return (
    <>
      <FormatButton />
      <Calculator sectionName="calculator" />
      <CalculatorSectionLayout
        section={"positionSizing"}
        footerElement={<ResetInputsButton sectionName={"positionSizing"} />}
      />
    </>
  );
}
