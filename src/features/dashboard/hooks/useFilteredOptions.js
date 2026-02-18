import { SEMANTIC_TYPES } from "@lib/analytics/schema";
import { useEffect, useMemo } from "react";

export default function useFilteredOptions({ series, options, setSeries }) {
  const optionsGroup = useMemo(() => {
    const first = series[0];
    return first?.type ? first.type : null;
  }, [series]);

  const baseOptions = useMemo(() => {
    return options.filter((o) => o.semanticType !== SEMANTIC_TYPES.STRING);
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!optionsGroup) return baseOptions;

    return baseOptions.filter((o) => o.semanticType === optionsGroup);
  }, [baseOptions, optionsGroup]);

  useEffect(() => {
    if (!optionsGroup) return;

    setSeries((prev) =>
      prev.map((s, i) => {
        if (i === 0 || !s.type) return s;
        return s.type === optionsGroup ? s : { key: "", name: "", type: "" };
      }),
    );
  }, [optionsGroup]);

  return { optionsGroup, filteredOptions, baseOptions };
}
