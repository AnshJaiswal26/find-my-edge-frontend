import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import "./ValidationTooltip.css";
import { tooltip } from "./content";
import { createPortal } from "react-dom";
import { useAutoFloating } from "@shared/hooks";

export default function ValidationTooltip({
  parentRef,
  message,
  type = "error",
  isVisible,
  position = "top",
  onClose,
  autoHide = true,
  duration = 5000,
  showCloseButton = false,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const events = useMemo(() => ["scroll", "resize"], []);

  const options = useMemo(
    () => ({
      preferred: position,
      offset: 10,
      // flip: false,
      // shift: false,
      arrow: {
        show: true,
        style: {
          border: "1px solid var(--border)",
        },
      },
    }),
    [position],
  );

  const ref = useAutoFloating(true, parentRef, options, events);

  useEffect(() => {
    if (isVisible) {
      // Mount first without animation
      setIsAnimating(false);

      // Next frame → trigger animation
      const raf = requestAnimationFrame(() => {
        setIsAnimating(true);
      });

      if (autoHide) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => {
          cancelAnimationFrame(raf);
          clearTimeout(timer);
        };
      }

      return () => cancelAnimationFrame(raf);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, autoHide, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose && onClose();
    }, 100);
  };

  const { className, icon: Icon } = tooltip[type];

  if (!isVisible) return null;

  return createPortal(
    <div ref={ref} className={`validation-tooltip ${className}`}>
      <div className={`tooltip-content ${isAnimating ? "animate-in" : ""}`}>
        <Icon className="tooltip-icon" />
        <p className="tooltip-message">{message}</p>
        {showCloseButton && (
          <button onClick={handleClose} className="tooltip-close">
            <X className="tooltip-close-icon" />
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
