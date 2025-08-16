"use client";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasPageAccess, PageAccess } from "@/lib/user-permissions";

interface AccessGuardProps {
  requiredPage: PageAccess;
  children: React.ReactNode;
}

export default function AccessGuard({ requiredPage, children }: AccessGuardProps) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // If no user, redirect to sign-in
    if (user === null) {
      router.push("/sign-in");
    }
  }, [user, router]);

  // Show loading while checking auth
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, show loading (will redirect via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-gray-400">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // Check if user has access to this page
  const hasAccess = hasPageAccess(user.clientMetadata, requiredPage);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-6">
            You don&apos;t have permission to access this page. Please contact your administrator.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/choose")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/sign-in")}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}