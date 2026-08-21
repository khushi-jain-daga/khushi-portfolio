"use client";

import { useEffect, useState } from "react";

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export default function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const element = ref.current;

      if (!element) {
        ticking = false;
        return;
      }

      const top = element.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(element.offsetHeight - window.innerHeight, 1);

      setProgress(clamp((window.scrollY - top) / distance));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}

