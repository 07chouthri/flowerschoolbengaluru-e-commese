// ScrollToTop.tsx
// Global scroll-to-top on route change for Wouter
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef(location);
  useEffect(() => {
    if (prevLocation.current !== location) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      prevLocation.current = location;
    }
  }, [location]);
  return null;
}
