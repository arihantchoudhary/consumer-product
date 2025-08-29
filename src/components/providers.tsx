"use client";

import { StackProvider } from "@stackframe/stack";
import { stackClient } from "@/lib/stack";
import { BackgroundSettingsProvider } from "@/contexts/background-settings";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackClient}>
      <BackgroundSettingsProvider>
        {children}
      </BackgroundSettingsProvider>
    </StackProvider>
  );
}
