import { useMemo } from "react";

export default function useNumericSchemas({ schemasById }) {
  const numericSchemas = useMemo(() => {
    return Object.values(schemasById).filter(
      (c) => c.type !== "text" && c.type !== "select",
    );
  }, [schemasById]);

  return numericSchemas;
}
