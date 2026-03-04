"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Shared across all instances — only update once per navigation
let globalPrevDepth = 0;
let globalDirection: "right" | "left" = "right";
let globalLastPath = "";

function getDirection(pathname: string): "right" | "left" {
  if (pathname === globalLastPath) return globalDirection;

  const currDepth = pathname.split("/").length;
  globalDirection = currDepth >= globalPrevDepth ? "right" : "left";
  globalPrevDepth = currDepth;
  globalLastPath = pathname;

  return globalDirection;
}

export default function DirectionalTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const direction = getDirection(pathname);

  return (
    <div
      className={
        direction === "right"
          ? "animate-slide-in-right"
          : "animate-slide-in-left"
      }
    >
      {children}
    </div>
  );
}
