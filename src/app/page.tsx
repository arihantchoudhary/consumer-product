"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // User is authenticated, redirect to choose page
      router.push("/choose");
    } else {
      // User is not authenticated, redirect to sign-in
      router.push("/sign-in");
    }
  }, [user, router]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
