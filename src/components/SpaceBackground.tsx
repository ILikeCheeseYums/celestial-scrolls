import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const SpaceScene = lazy(() => import("./SpaceScene"));

export function SpaceBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <ClientOnly fallback={<div className="h-full w-full bg-background" />}>
        <Suspense fallback={<div className="h-full w-full bg-background" />}>
          <SpaceScene />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
