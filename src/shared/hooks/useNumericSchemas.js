import { useMemo } from "react";

export default function useNumericSchemas({ schemasById }) {
  return useMemo(() => {
    return Object.values(schemasById).filter(
      (c) => c.type !== "text" && c.type !== "select",
    );
  }, [schemasById]);
}
