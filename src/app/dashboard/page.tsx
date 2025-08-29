"use client";

import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import AnimatedBackground from "@/components/animated-background";
import { GreetingSection } from "@/components/dashboard-page/GreetingSection";
import { Loader2, Plus, Bot, Play, MoreVertical, Link2, Phone, Clock, Calendar, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateAgentModal } from "@/components/CreateAgentModal";
import { useUser } from "@stackframe/stack";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const user = useUser();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Array<{
    conversation_id: string;
    agent_id: string;
    agent_name?: string;
    created_at: string;
    status: string;
    duration: number;
    start_time_unix_secs: number;
    call_duration_secs: number;
    message_count: number;
    transcript_summary?: string;
    call_successful?: string;
    analysis?: {
      sentiment: string;
      call_successful: boolean;
      transcript_summary: string;
    };
  }>>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<{
    id: string;
    name: string;
    createdAt?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get created agents from user metadata
  const createdAgents = useMemo(() => user?.clientMetadata?.created_agents || [], [user?.clientMetadata?.created_agents]);
  
  const handleShareAgent = (agentId: string) => {
    const shareUrl = `${window.location.origin}/agent/${agentId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };
  
  const handleDeleteAgent = async () => {
    if (!agentToDelete || isDeleting) return;
    
    setIsDeleting(true);
    try {
      // Just remove from user metadata
      if (user) {
        const updatedAgents = createdAgents.filter((a: { id: string; name: string }) => a.id !== agentToDelete.id);
        await user.update({
          clientMetadata: {
            ...user.clientMetadata,
            created_agents: updatedAgents,
          },
        });
      }
      
      toast.success("Agent removed from your list");
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error removing agent:", error);
      toast.error("Failed to remove agent");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Fetch conversations
  const fetchConversations = useCallback(async (cursor?: string) => {
    setLoadingConversations(true);
    try {
      const params = new URLSearchParams();
      if (cursor) params.append("cursor", cursor);
      params.append("limit", "20");
      
      // Add agent IDs from user metadata - these are the ElevenLabs IDs
      const agentIds = createdAgents.map((agent: { id: string; name: string }) => agent.id).join(',');
      console.log("Fetching conversations for agents:", agentIds);
      
      if (agentIds) {
        params.append("agent_ids", agentIds);
      } else {
        // No agents, don't fetch conversations
        console.log("No agents found in metadata, skipping conversation fetch");
        setConversations([]);
        setLoadingConversations(false);
        return;
      }
      
      const response = await fetch(
        `http://localhost:8001/api/agents/conversations?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (cursor) {
        setConversations(prev => [...prev, ...data.conversations]);
      } else {
        setConversations(data.conversations);
      }
      
      setHasMore(data.has_more);
      setNextCursor(data.next_cursor);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  }, [createdAgents]);
  
  useEffect(() => {
    if (createdAgents.length > 0) {
      fetchConversations();
    }
  }, [createdAgents.length, fetchConversations]);
  
  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date
  const formatDate = (unixTime: number) => {
    return new Date(unixTime * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <>
      <AnimatedBackground />
      <CreateAgentModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
        onSuccess={(agentId) => {
          console.log("Created agent:", agentId);
        }}
      />
      <div className="relative z-10 min-h-screen p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Greeting Section */}
            <GreetingSection />
            
            {/* Tabs for Agents and Conversations */}
            <Tabs defaultValue="agents" className="w-full">
              <TabsList className="bg-white/90 backdrop-blur-xl border border-gray-200">
                <TabsTrigger value="agents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  <Bot className="h-4 w-4 mr-2" />
                  My Agents
                </TabsTrigger>
                <TabsTrigger value="conversations" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Past Conversations
                </TabsTrigger>
              </TabsList>
              
              {/* Agents Tab */}
              <TabsContent value="agents">
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900">My Agents</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
                      onClick={() => setCreateModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Agent
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Carousel container */}
                      <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-4 pl-4" style={{ scrollSnapType: 'x mandatory' }}>
                          {/* Agent cards */}
                          {createdAgents.length > 0 ? (
                            createdAgents.map((agent: { id: string; name: string; createdAt?: string }) => (
                              <div
                                key={agent.id}
                                className="flex-none w-64 bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
                                style={{ scrollSnapAlign: 'start' }}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                                      {agent.name?.substring(0, 2).toUpperCase() || "AI"}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-gray-900 font-medium">{agent.name}</h4>
                                      <p className="text-gray-500 text-xs">
                                        {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "Recently created"}
                                      </p>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleShareAgent(agent.id)}>
                                        <Link2 className="mr-2 h-4 w-4" />
                                        Share
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          setAgentToDelete(agent);
                                          setDeleteDialogOpen(true);
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <div className="flex justify-between items-center">
                                  <Button
                                    size="sm"
                                    className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                                    onClick={() => router.push(`/agent/${agent.id}`)}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Talk
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex-none w-64 bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center shadow-sm">
                              <p className="text-gray-500 text-center">No agents yet. Create your first one!</p>
                            </div>
                          )}
                          
                          {/* Add new agent card */}
                          <div
                            className="flex-none w-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed p-4 hover:bg-gray-100 transition-all cursor-pointer flex items-center justify-center"
                            style={{ scrollSnapAlign: 'start' }}
                            onClick={() => setCreateModalOpen(true)}
                          >
                            <div className="text-center">
                              <Plus className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                              <p className="text-gray-500">Create New Agent</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Scroll indicators */}
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Conversations Tab */}
              <TabsContent value="conversations">
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">Past Conversations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingConversations ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                      </div>
                    ) : conversations.filter((conv) => 
                      createdAgents.some((agent: { id: string; name: string }) => agent.id === conv.agent_id)
                    ).length > 0 ? (
                      <div className="space-y-3">
                        {conversations
                          .filter((conv) => {
                            // Only show conversations from agents in user's metadata
                            return createdAgents.some((agent: { id: string; name: string }) => agent.id === conv.agent_id);
                          })
                          .map((conv) => {
                          const agent = createdAgents.find((a: { id: string; name: string }) => a.id === conv.agent_id);
                          return (
                            <div
                              key={conv.conversation_id}
                              className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                                      {agent?.name?.substring(0, 2).toUpperCase() || "AI"}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        {conv.agent_name || agent?.name || "Unknown Agent"}
                                      </h4>
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          {formatDate(conv.start_time_unix_secs)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {formatDuration(conv.call_duration_secs)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <MessageSquare className="h-3 w-3" />
                                          {conv.message_count} messages
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {conv.transcript_summary && (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                      {conv.transcript_summary}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    conv.call_successful === 'success' 
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {conv.call_successful === 'success' ? 'Successful' : 'Failed'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {hasMore && (
                          <div className="flex justify-center pt-4">
                            <Button
                              variant="outline"
                              onClick={() => fetchConversations(nextCursor || undefined)}
                              disabled={loadingConversations}
                            >
                              {loadingConversations ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Load More
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Phone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No conversations yet</p>
                        <p className="text-sm text-gray-400 mt-1">Start talking to your agents to see conversations here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
          </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{agentToDelete?.name}&quot; from your list? The agent will still exist in ElevenLabs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAgent}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
