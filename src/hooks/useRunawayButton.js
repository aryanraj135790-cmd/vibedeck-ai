import { useState, useCallback } from "react";
import { useSoundFX } from "./useSoundFX";

export function useRunawayButton(containerRef) {
  const [yesScale, setYesScale] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [evasionCount, setEvasionCount] = useState(0);
  const { playPop } = useSoundFX();

  const handleEvasion = useCallback(
    (e) => {
      // Prevent scrolling or zooming on touch devices when trying to tap runaway button
      if (e && e.type === "touchstart") {
        e.preventDefault();
      }

      playPop();

      if (!containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const maxX = container.width / 2 - 60;
      const maxY = container.height / 2 - 40;

      // Calculate dynamic random position within card boundary
      const newX = (Math.random() - 0.5) * maxX * 2;
      const newY = (Math.random() - 0.5) * maxY * 2;

      setNoPosition({ x: newX, y: newY });
      setYesScale((prev) => Math.min(prev + 0.2, 2.5));
      setEvasionCount((prev) => prev + 1);
    },
    [containerRef, playPop],
  );

  // Clean state reset when changing cards/steps
  const resetRunaway = useCallback(() => {
    setYesScale(1);
    setNoPosition({ x: 0, y: 0 });
    setEvasionCount(0);
  }, []);

  return {
    yesScale,
    noPosition,
    evasionCount,
    handleEvasion,
    resetRunaway,
  };
}
