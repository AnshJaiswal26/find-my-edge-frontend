import { useEffect } from "react";

export default function useClickOutside(ref, handler, onWindow = false) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    }
    if (onWindow) {
      window.addEventListener("mousedown", handleClickOutside);
      return () => {
        window.removeEventListener("mousedown", handleClickOutside);
      };
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
}
