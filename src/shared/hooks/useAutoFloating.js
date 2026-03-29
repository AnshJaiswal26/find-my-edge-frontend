import { useEffect, useRef } from "react";
import { positionElement } from "../utils";
import { useGlobalEvents } from "./useGlobalEvents";

export function useAutoFloating(active, targetRef, options, events) {
  const ref = useRef(null);

  useEffect(() => {
    if (active && targetRef && ref) {
      positionElement(targetRef.current, ref.current, options);
    }
  }, [active]);

  useGlobalEvents(
    targetRef && ref ? events : null,
    targetRef && ref
      ? () => {
          requestAnimationFrame(() => {
            positionElement(targetRef.current, ref.current, {
              preferred: "top",
              offset: 10,
            });
          });
        }
      : null,
  );

  return ref;
}
