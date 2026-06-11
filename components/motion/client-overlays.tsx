"use client";
import dynamic from "next/dynamic";

const CursorFollower = dynamic(
  () =>
    import("@/components/motion/cursor-follower").then((m) => ({
      default: m.CursorFollower,
    })),
  { ssr: false },
);

export function ClientOverlays() {
  return <CursorFollower />;
}
