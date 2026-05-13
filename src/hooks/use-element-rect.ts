import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";

export interface ElementRect {
  width: number;
  height: number;
  top: number;
  left: number;
}

export function useElementRect(ref: RefObject<HTMLElement | null>) {
  const [rect, setRect] = useState<ElementRect>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });
  const latestRectRef = useRef(rect);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let rafId: number | null = null;

    const updateRect = () => {
      if (!element) return;
      const r = element.getBoundingClientRect();
      const nextRect = {
        width: r.width,
        height: r.height,
        top: r.top,
        left: r.left,
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

    const scheduleUpdate = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateRect);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(element);
    window.addEventListener("scroll", scheduleUpdate, true);
    scheduleUpdate();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [ref]);

  return rect;
}
