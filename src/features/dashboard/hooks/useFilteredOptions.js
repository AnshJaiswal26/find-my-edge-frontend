import { SCHEMA_TYPES_GROUP } from "@lib/analytics/schema";
import { useEffect, useMemo } from "react";

export default function useFilteredOptions({ series, options, setSeries }) {
  const optionsGroup = useMemo(() => {
    const first = series[0];
    return first?.type ? SCHEMA_TYPES_GROUP[first.type] : null;
  }, [series]);

  const baseOptions = useMemo(() => {
    return options.filter((o) => {
      const group = SCHEMA_TYPES_GROUP[o.type];
      return group && group !== "text"; // allow all numeric/date/time
    });
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!optionsGroup) return baseOptions;

    return baseOptions.filter(
      (o) => SCHEMA_TYPES_GROUP[o.type] === optionsGroup,
    );
  }, [baseOptions, optionsGroup]);

  useEffect(() => {
    if (!optionsGroup) return;

    setSeries((prev) =>
      prev.map((s, i) => {
        if (i === 0 || !s.type) return s;

        return SCHEMA_TYPES_GROUP[s.type] === optionsGroup
          ? s
          : { key: "", name: "", type: "" };
      }),
    );
  }, [optionsGroup]);

  return { optionsGroup, filteredOptions, baseOptions };
}
