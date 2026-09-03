import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const SpaceScene = lazy(() => import("./SpaceScene"));

export function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <ClientOnly fallback={<div className="h-full w-full bg-[#04060f]" />}>
        <Suspense fallback={<div className="h-full w-full bg-[#04060f]" />}>
          <SpaceScene />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
