import { useEffect } from "react";
import { useUIStore } from "@shared/stores";

export default function useGlobalUIClose() {
  useEffect(() => {
    const { setSelect, setColorPicker } = useUIStore.getState();

    const close = () => {
      setSelect(null);
      setColorPicker(null);
    };

    const handlePointerDown = (e) => {
      const { activeSelect, activeColorPicker } = useUIStore.getState();

      if (!activeSelect && !activeColorPicker) return;

      const buttonEl = document.getElementById(activeSelect?.buttonId);
      const listEl = document.getElementById(activeSelect?.listId);
      const triggerEl = document.getElementById(activeColorPicker?.triggerId);
      const paletteEl = document.getElementById(activeColorPicker?.paletteId);

      if (
        buttonEl?.contains(e.target) ||
        listEl?.contains(e.target) ||
        triggerEl?.contains(e.target) ||
        paletteEl?.contains(e.target)
      ) {
        return;
      }

      close();
    };

    const handleVisibility = () => {
      if (document.hidden) close();
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", close);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("scroll", handlePointerDown, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", close);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("scroll", handlePointerDown);
    };
  }, []);
}
