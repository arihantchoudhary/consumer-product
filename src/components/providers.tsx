"use client";

import { StackProvider } from "@stackframe/stack";
import { stackClient } from "@/lib/stack";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackClient}>
      {children}
    </StackProvider>
  );
}
