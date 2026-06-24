import { useEffect, useState } from "react";

export function useReducedMotion() {
  // Default to false during Server-Side Rendering
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // This code only runs in the browser, where 'window' safely exists
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set the initial value on client mount
    setMatches(media.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, []);

  return matches;
}