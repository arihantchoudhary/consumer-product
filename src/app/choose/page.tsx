"use client";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedBackground from "@/components/animated-background";
import { Loader2 } from "lucide-react";
import { getUserAllowedPages, categorizeUserPages, PageAccess } from "@/lib/user-permissions";

export default function ChoosePage() {
  const user = useUser();
  const router = useRouter();

  // Helper function to render page buttons
  const renderPageButton = (page: PageAccess, isOwned: boolean = false) => {
    const pageConfigs = {
      savar: { name: "Savar", variant: "outline" as const },
      arihant: { name: "Arihant", variant: "outline" as const },
      sajjad: { name: "Sajjad", variant: "outline" as const },
      sasha: { name: "Sasha", variant: "outline" as const },
      guy: { name: "Guy Ruttenberg", variant: "outline" as const },
      neeraj: { name: "Neeraj", variant: "outline" as const },
      aaman: { name: "Aaman", variant: "outline" as const },
      parth: { name: "Parth", variant: "outline" as const },
      srivardhan: { name: "Srivardhan", variant: "outline" as const },
      "transcript-analyzer": { name: "Transcript Analyzer", variant: "outline" as const },
      "legal-assistant": { name: "Legal Assistant", variant: "outline" as const },
    };

    const config = pageConfigs[page];
    if (!config) return null;

    return (
      <Button
        key={page}
        onClick={() => router.push(`/${page}`)}
        size="lg"
        variant={isOwned ? "default" : config.variant}
        className={`w-full ${isOwned ? "bg-blue-600 hover:bg-blue-700 border-blue-500" : ""}`}
      >
        {config.name}
      </Button>
    );
  };

  useEffect(() => {
    // If no user, redirect to sign-in
    if (user === null) {
      router.push("/sign-in");
    }
  }, [user, router]);

  const handleSignOut = async () => {
    if (user) {
      await user.signOut();
    }
    router.push("/sign-in");
  };

  // Get user's categorized pages
  const { ownedPages, otherPages } = categorizeUserPages(user?.clientMetadata, user?.primaryEmail || undefined);
  const allowedPages = getUserAllowedPages(user?.clientMetadata);

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

  return (
    <>
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-black/80 backdrop-blur-xl border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome!
            </CardTitle>
            <CardDescription className="text-gray-400">
              Logged in as: {user.primaryEmail}
              {user.clientMetadata?.agentId && (
                <div className="mt-1 text-xs text-gray-500">
                  Agent ID: {user.clientMetadata.agentId}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            
            <div className="space-y-4">
              {allowedPages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    You don&apos;t have access to any pages yet.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Contact your administrator to get access.
                  </p>
                </div>
              ) : (
                <>
                  {/* Other Pages Section */}
                  {otherPages.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Prepare for your next meeting with</h3>
                        <p className="text-sm text-gray-500 mb-4">Pages you have access to</p>
                      </div>
                      <div className="space-y-2">
                        {otherPages.map(page => renderPageButton(page, false))}
                      </div>
                    </div>
                  )}
                  
                  {/* Divider between sections */}
                  {ownedPages.length > 0 && otherPages.length > 0 && (
                    <div className="flex items-center my-6">
                      <div className="flex-1 h-px bg-gray-600"></div>
                      <div className="px-3 text-xs text-gray-500">OR</div>
                      <div className="flex-1 h-px bg-gray-600"></div>
                    </div>
                  )}
                  
                  {/* Your Agent Pages Section */}
                  {ownedPages.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-2">Your Pages</h3>
                        <p className="text-sm text-gray-400 mb-4">Pages you own and manage</p>
                      </div>
                      <div className="space-y-2">
                        {ownedPages.map(page => renderPageButton(page, true))}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
