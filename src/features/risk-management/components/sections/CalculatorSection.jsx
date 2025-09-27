import { useMemo } from "react";
import { debounce } from "lodash";
import { Button } from "@ui";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { useClearLogic } from "@features/risk-management/hooks";
import { CalculatorSectionLayout } from "@features/risk-management/layout";
import RenderLogger from "@Profiler";

export default function CalculatorSection({ sectionName }) {
  const updateTransaction = useRiskManagementStore(
    (s) => s.updater.transaction
  );

  const debouncedsetHoveredSection = useMemo(() => {
    const handler = debounce((name) => {
      updateTransaction(name);
    }, 100);

    return handler;
  }, [updateTransaction]);

  const isTargetOrSL = sectionName !== "calculator";

  return (
    // <RenderLogger id={"CalculatorSection"} why={sectionName}>
    <CalculatorSectionLayout
      section={sectionName}
      onMouseEnter={debouncedsetHoveredSection}
      headerElement={
        isTargetOrSL && (
          <Button
            text={`Place ${sectionName}`}
            color="#05ab72"
            style={{
              padding: "3px 10px",
              fontSize: "12px",
              disabled: true,
            }}
          />
        )
      }
      footerElement={
        !isTargetOrSL && <FooterButtons sectionName={sectionName} />
      }
    />
    // </RenderLogger>
  );
}

function FooterButtons({ sectionName }) {
  const clearSection = useClearLogic();

  return (
    <div className="footer-buttons">
      <Button
        text="Clear All"
        color="#fe5a5a"
        onClick={() => clearSection(sectionName)}
        style={{
          padding: "3px 10px",
          fontSize: "12px",
        }}
      />
    </div>
  );
}
