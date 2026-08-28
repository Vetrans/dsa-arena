import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
export function useReveal(selector = "[data-reveal]") {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(
      () =>
        gsap.from(selector, {
          y: 28,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }),
      root,
    );
    return () => ctx.revert();
  }, [selector]);
  return root;
}
