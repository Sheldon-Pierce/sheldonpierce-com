"use client";
import { useEffect, useRef, useState } from "react";

const MAX_DEPTH = 200;

/**
 * The signature depth-rail gauge: a fixed left-edge ruler whose marker and
 * readout track scroll depth (0 m at the surface → 200 m at bedrock).
 * Decorative, so aria-hidden; hidden entirely below 720px via CSS.
 */
export function DepthRail() {
  const markerRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setDepth(Math.round(p * MAX_DEPTH));
      if (markerRef.current) {
        markerRef.current.style.top = `calc(${p * 100}% - ${p * 9}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="rail" aria-hidden="true">
      <div className="ticks" />
      <div className="marker" ref={markerRef} />
      <div className="depth-readout">
        depth
        <b>{depth} m</b>
      </div>
    </aside>
  );
}
