"use client";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedBackground from "@/components/animated-background";
import { Loader2 } from "lucide-react";
import { getUserAllowedPages, PageAccess } from "@/lib/user-permissions";

export default function ChoosePage() {
  const user = useUser();
  const router = useRouter();

  // Agent configurations - this maps page names to their display names and agent IDs
  const agentConfigs: Record<string, { name: string; agentId: string }> = {
    savar: { name: "Savar", agentId: "agent_6501k310pz99fvkts53hqjte6v0p" },
    arihant: { name: "Arihant", agentId: "agent_7701k30qqnxces59w2a4tsxaneq9" },
    sajjad: { name: "Sajjad", agentId: "agent_0301k2tznxawhz0wfz8amcfyktx5" },
    sasha: { name: "Sasha", agentId: "agent_2901k2tzm9x2b7r9c4h5a0xcv21x" },
    guy: { name: "Guy Ruttenberg", agentId: "agent_7201k2rzy9tscqxayvrvs0x6bqk0" },
    neeraj: { name: "Neeraj", agentId: "agent_0501k30qjpw9fbharan0mmt0sj03" },
    aaman: { name: "Aaman", agentId: "agent_6301k2rzxtr7f04ba7z12786rrwr" },
    parth: { name: "Parth", agentId: "agent_3401k3b7nxj34xw8hs2j8zy5rrwn" },
    srivardhan: { name: "Srivardhan", agentId: "agent_2301k3b7ps5p74n9xbfyk3y6xqkh" }
  };

  // Special pages that don't have agents
  const specialPageConfigs: Record<string, { name: string }> = {
    "transcript-analyzer": { name: "Transcript Analyzer" },
    "legal-assistant": { name: "Legal Assistant" },
    "dashboard": { name: "Dashboard" },
  };

  const renderPageButton = (page: PageAccess) => {
    // Check if this is an agent page
    if (page in agentConfigs) {
      const config = agentConfigs[page];
      return (
        <Button
          key={page}
          onClick={() => {
            // Store the selected agent in session storage
            sessionStorage.setItem('selectedAgentId', config.agentId);
            sessionStorage.setItem('selectedAgentName', config.name);
            router.push('/agent');
          }}
          size="lg"
          variant="outline"
          className="w-full"
        >
          {config.name}
        </Button>
      );
    }
    
    // Handle special pages
    if (page in specialPageConfigs) {
      const config = specialPageConfigs[page];
      return (
        <Button
          key={page}
          onClick={() => router.push(`/${page}`)}
          size="lg"
          variant="outline"
          className="w-full"
        >
          {config.name}
        </Button>
      );
    }

    return null;
  };

  useEffect(() => {
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
              Choose Your Assistant
            </CardTitle>
            <CardDescription className="text-gray-400">
              Logged in as: {user.primaryEmail}
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
                  <div className="space-y-3">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">
                        Select an AI Assistant
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {allowedPages.map(page => renderPageButton(page))}
                    </div>
                  </div>
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