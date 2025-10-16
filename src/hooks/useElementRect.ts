import { useCallback, useEffect, useRef, useState } from "react";

export interface ElementRect {
  width: number;
  height: number;
  top: number;
  left: number;
}

const defaultRect: ElementRect = { width: 0, height: 0, top: 0, left: 0 };

export const useElementRect = <T extends HTMLElement>() => {
  const [rect, setRect] = useState<ElementRect>(defaultRect);
  const cleanupRef = useRef<(() => void) | null>(null);
  const latestRectRef = useRef(rect);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const ref = useCallback((node: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!node) {
      return;
    }

    const updateRect = () => {
      const bounds = node.getBoundingClientRect();
      const nextRect: ElementRect = {
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left,
      };

      const prevRect = latestRectRef.current;
      const hasChanged =
        prevRect.width !== nextRect.width ||
        prevRect.height !== nextRect.height ||
        prevRect.top !== nextRect.top ||
        prevRect.left !== nextRect.left;

      if (hasChanged) {
        latestRectRef.current = nextRect;
        setRect(nextRect);
      }
    };

    let rafId: number | null = null;

    const scheduleUpdate = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateRect);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(node);
    window.addEventListener("scroll", scheduleUpdate, true);
    scheduleUpdate();

    cleanupRef.current = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, []);

  return { rect, ref } as const;
};
