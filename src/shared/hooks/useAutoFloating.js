import { useEffect, useRef } from "react";
import { positionElement } from "../utils";
import { useGlobalEvents } from "./useGlobalEvents";

export function useAutoFloating(active, targetRef, options, events) {
  const ref = useRef(null);

  const isPresent =
    targetRef && ref.current !== null && targetRef.current !== null;

  useEffect(() => {
    if (active && isPresent) {
      positionElement(targetRef.current, ref.current, options);
    }
  }, [active, options, isPresent, targetRef, ref]);

  useGlobalEvents(
    isPresent ? events : null,
    isPresent
      ? () => {
          requestAnimationFrame(() => {
            positionElement(targetRef.current, ref.current, options);
          });
        }
      : null,
  );

  return ref;
}
