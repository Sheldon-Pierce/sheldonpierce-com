"use client";
import dynamic from "next/dynamic";

const CursorFollower = dynamic(
  () =>
    import("@/components/motion/cursor-follower").then((m) => ({
      default: m.CursorFollower,
    })),
  { ssr: false },
);

const PageTransition = dynamic(
  () =>
    import("@/components/motion/page-transition").then((m) => ({
      default: m.PageTransition,
    })),
  { ssr: false },
);

export function ClientOverlays() {
  return (
    <>
      <CursorFollower />
      <PageTransition />
    </>
  );
}
