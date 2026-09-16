import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function useNavbarScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    function handleScroll() {
      if (ticking.current) return;

      ticking.current = true;
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;

        // Determine if scrolled past threshold
        setIsScrolled(currentScrollY > 20);

        // Hide when scrolling down past 80px, show immediately when scrolling up
        if (currentScrollY > 80 && delta > 4 && !mobileOpen) {
          setIsHidden(true);
        } else if (delta < -4 || currentScrollY <= 30) {
          setIsHidden(false);
        }

        lastScrollY.current = Math.max(0, currentScrollY);
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  return {
    isScrolled,
    isHidden: isHidden && !mobileOpen,
    mobileOpen,
    setMobileOpen
  };
}
