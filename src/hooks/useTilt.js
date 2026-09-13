import { useState, useCallback } from "react";

/**
 * Cursor / touch 3D tilt physics for card surfaces.
 * Returns a style transform + the mouse handlers to attach to the card element.
 */
export function useTilt(maxDeg = 18) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * maxDeg, y: -x * maxDeg });
    },
    [maxDeg],
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const tiltStyle = {
    transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: "transform 0.15s ease-out",
  };

  const tiltHandlers = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  return { tiltStyle, tiltHandlers };
}
