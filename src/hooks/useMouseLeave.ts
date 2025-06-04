import { useEffect } from "react";

export const useMouseLeave = (callback: (event: MouseEvent) => void) => {
  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      // Check if the mouse is leaving the viewport from the top
      if (event.clientY <= 0) {
        callback(event);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [callback]);
};
