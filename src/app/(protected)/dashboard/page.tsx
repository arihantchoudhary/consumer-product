"use client";

import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import AccessGuard from "@/components/access-guard";
import AnimatedBackground from "@/components/animated-background";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Eye, Loader2, User } from "lucide-react";

// Types based on your API payload
interface TranscriptItem {
  speaker: string;
  message: string;
  timestamp: number;
  // ... other properties
}

interface Conversation {
  agent_id: string;
  conversation_id: string;
  status: "initiated" | "in-progress" | "processing" | "done" | "failed";
  transcript: TranscriptItem[];
  metadata: Record<string, any>;
  has_audio: boolean;
  has_user_audio: boolean;
  has_response_audio: boolean;
  user_id: string | null;
  analysis: Record<string, any> | null;
  conversation_initiation_client_data: Record<string, any> | null;
}

interface UserProfile {
  user_id: string;
  display_name: string;
  email: string;
  last_active: string;
  initials: string;
}

// Mock user data based on your list
const mockUsers: UserProfile[] = [
  {
    user_id: "4d9c35a6-8387-4486-8364-1d1ce964b500",
    display_name: "Pinal Shah",
    email: "pinal.shah@nangia.com",
    last_active: "5 hours ago",
    initials: "PS",
  },
  {
    user_id: "73ca1e40-2078-42b9-b99e-d024fc13775a",
    display_name: "Kishan Mundhra",
    email: "kishan.mundhra@nangia.com",
    last_active: "3 hours ago",
    initials: "KM",
  },
  {
    user_id: "a4593a49-a33d-4aef-b6f3-9f9d38911022",
    display_name: "Nikita Bathija",
    email: "nikita.bathija@nangia.com",
    last_active: "2 hours ago",
    initials: "NB",
  },
  {
    user_id: "5bf458bd-c56e-4a07-8d54-eb58f9abbc5c",
    display_name: "Naitik Doshi",
    email: "naitik.doshi@nangia-andersen.com",
    last_active: "1 hour ago",
    initials: "ND",
  },
  {
    user_id: "d5bf8800-6c29-4fda-a63e-abb2fc1805e4",
    display_name: "Khushboo Shah",
    email: "khushboo.shah@nangia.com",
    last_active: "4 hours ago",
    initials: "KS",
  },
];

// Separate component for the conversation table
interface ConversationTableProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  getStatusBadge: (status: Conversation["status"]) => {
    variant: "outline";
    className: string;
  };
  getUserProfile: (userId: string | null) => UserProfile | null;
  showUserColumn?: boolean;
}

function ConversationTable({
  conversations,
  onSelectConversation,
  getStatusBadge,
  getUserProfile,
  showUserColumn = true,
}: ConversationTableProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No conversations yet
        </h3>
        <p className="mt-2 text-gray-500">
          Conversations will appear here once they are processed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="text-gray-700">Conversation ID</TableHead>
            <TableHead className="text-gray-700">Status</TableHead>
            {showUserColumn && (
              <TableHead className="text-gray-700">User</TableHead>
            )}
            <TableHead className="text-gray-700">Audio</TableHead>
            <TableHead className="text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => {
            const statusBadge = getStatusBadge(conversation.status);
            const userProfile = getUserProfile(conversation.user_id);

            return (
              <TableRow
                key={conversation.conversation_id}
                className="border-gray-200"
              >
                <TableCell className="font-mono text-sm">
                  {conversation.conversation_id}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusBadge.variant}
                    className={statusBadge.className}
                  >
                    {conversation.status}
                  </Badge>
                </TableCell>
                {showUserColumn && (
                  <TableCell>
                    {userProfile ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {userProfile.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {userProfile.display_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {userProfile.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Anonymous</span>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex gap-1">
                    {conversation.has_user_audio && (
                      <Badge variant="outline" className="text-xs">
                        User
                      </Badge>
                    )}
                    {conversation.has_response_audio && (
                      <Badge variant="outline" className="text-xs">
                        Agent
                      </Badge>
                    )}
                    {!conversation.has_audio && (
                      <span className="text-gray-400 text-xs">No audio</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectConversation(conversation)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleSignOut = async () => {
    if (user) {
      await user.signOut();
    }
    router.push("/sign-in");
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("http://localhost:8001/conversations?agent_id=agent_0501k30qjpw9fbharan0mmt0sj03&call_successful=success&call_start_before_unix=1692432576&call_start_after_unix=1692346176&user_id=user_123&summary_mode=exclude");
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const getUserProfile = (userId: string | null): UserProfile | null => {
    if (!userId) return null;
    return mockUsers.find((user) => user.user_id === userId) || null;
  };

  const getConversationsByUser = (userId: string) => {
    return conversations.filter((conv) => conv.user_id === userId);
  };

  const getAllConversations = () => {
    return conversations;
  };

  const getUnclassifiedConversations = () => {
    const knownUserIds = mockUsers.map((user) => user.user_id);
    return conversations.filter(
      (conv) => !conv.user_id || !knownUserIds.includes(conv.user_id)
    );
  };

  const getConversationsForTab = (tabId: string) => {
    if (tabId === "all") return getAllConversations();
    if (tabId === "others") return getUnclassifiedConversations();
    return getConversationsByUser(tabId);
  };

  const getStatusBadge = (status: Conversation["status"]) => {
    const statusConfig = {
      initiated: {
        variant: "outline" as const,
        className: "bg-gray-50 text-gray-700 border-gray-200",
      },
      "in-progress": {
        variant: "outline" as const,
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      processing: {
        variant: "outline" as const,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      done: {
        variant: "outline" as const,
        className: "bg-green-50 text-green-700 border-green-200",
      },
      failed: {
        variant: "outline" as const,
        className: "bg-red-50 text-red-700 border-red-200",
      },
    };

    return statusConfig[status] || statusConfig.initiated;
  };

  const formatTranscript = (transcript: TranscriptItem[]) => {
    return transcript
      .map((item) => `${item.speaker}: ${item.message}`)
      .join("\n");
  };

  if (loading) {
    return (
      <AccessGuard requiredPage="dashboard">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white">Loading conversations...</p>
          </div>
        </div>
      </AccessGuard>
    );
  }

  return (
    <AccessGuard requiredPage="dashboard">
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Conversation Dashboard
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage conversation transcripts
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </Button>
            </CardHeader>
          </Card>

          {/* Conversations with User Tabs */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                Conversations by User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="w-full overflow-x-auto">
                  <TabsList className="inline-flex h-12 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground w-max">
                    <TabsTrigger
                      value="all"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                    >
                      <User className="h-4 w-4" />
                      <span>All</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {conversations.length}
                      </Badge>
                    </TabsTrigger>
                    {mockUsers.map((userProfile) => {
                      const userConversations = getConversationsByUser(
                        userProfile.user_id
                      );
                      return (
                        <TabsTrigger
                          key={userProfile.user_id}
                          value={userProfile.user_id}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {userProfile.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">
                            {userProfile.display_name.split(" ")[0]}
                          </span>
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {userConversations.length}
                          </Badge>
                        </TabsTrigger>
                      );
                    })}
                    <TabsTrigger
                      value="others"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Others</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {getUnclassifiedConversations().length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-4">
                  <ConversationTable
                    conversations={getAllConversations()}
                    onSelectConversation={setSelectedConversation}
                    getStatusBadge={getStatusBadge}
                    getUserProfile={getUserProfile}
                  />
                </TabsContent>

                {mockUsers.map((userProfile) => (
                  <TabsContent
                    key={userProfile.user_id}
                    value={userProfile.user_id}
                    className="mt-4"
                  >
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {userProfile.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {userProfile.display_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {userProfile.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last active: {userProfile.last_active}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ConversationTable
                      conversations={getConversationsByUser(
                        userProfile.user_id
                      )}
                      onSelectConversation={setSelectedConversation}
                      getStatusBadge={getStatusBadge}
                      getUserProfile={getUserProfile}
                      showUserColumn={false}
                    />
                  </TabsContent>
                ))}

                <TabsContent value="others" className="mt-4">
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Unclassified Users
                        </h3>
                        <p className="text-sm text-gray-600">
                          Conversations from unknown or anonymous users
                        </p>
                      </div>
                    </div>
                  </div>
                  <ConversationTable
                    conversations={getUnclassifiedConversations()}
                    onSelectConversation={setSelectedConversation}
                    getStatusBadge={getStatusBadge}
                    getUserProfile={getUserProfile}
                  />
                </TabsContent>
              </Tabs>

              {/* Enhanced Conversation Summary Modal */}
              <Dialog
                open={!!selectedConversation}
                onOpenChange={() => setSelectedConversation(null)}
              >
                <DialogContent className="max-w-4xl max-h-[85vh] bg-white">
                  {selectedConversation && (
                    <>
                      <DialogHeader className="border-b pb-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  getStatusBadge(selectedConversation.status)
                                    .variant
                                }
                                className={
                                  getStatusBadge(selectedConversation.status)
                                    .className
                                }
                              >
                                {selectedConversation.status}
                              </Badge>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">
                                {selectedConversation.metadata?.duration ||
                                  "Duration unknown"}
                              </span>
                            </div>
                          </div>
                          <DialogTitle className="text-gray-900 font-mono text-sm">
                            {selectedConversation.conversation_id}
                          </DialogTitle>
                        </div>
                        <DialogDescription className="text-gray-600">
                          {selectedConversation.metadata?.topic && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-medium">Topic:</span>
                              <Badge variant="outline" className="text-xs">
                                {selectedConversation.metadata.topic}
                              </Badge>
                            </div>
                          )}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {selectedConversation.analysis ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  Summary
                                </h4>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                  <p className="text-gray-800 text-sm leading-relaxed">
                                    {selectedConversation.analysis.summary}
                                  </p>
                                </div>
                              </div>

                              {selectedConversation.analysis.key_topics && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    Key Topics
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedConversation.analysis.key_topics.map(
                                      (topic, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="bg-green-50 text-green-700 border-green-200"
                                        >
                                          {topic}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {selectedConversation.analysis.sentiment && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    Sentiment
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className="bg-purple-50 text-purple-700 border-purple-200"
                                  >
                                    {selectedConversation.analysis.sentiment}
                                  </Badge>
                                </div>
                              )}

                              {selectedConversation.analysis.action_items && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                    Action Items
                                  </h4>
                                  <ul className="space-y-2">
                                    {selectedConversation.analysis.action_items.map(
                                      (item, index) => (
                                        <li
                                          key={index}
                                          className="flex items-start gap-2 text-sm text-gray-700"
                                        >
                                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                                          {item}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                Full Transcript
                              </h4>
                              <ScrollArea className="h-[400px] w-full rounded-lg border bg-gray-50 p-4">
                                <div className="space-y-3">
                                  {selectedConversation.transcript.length >
                                  0 ? (
                                    selectedConversation.transcript.map(
                                      (item, index) => (
                                        <div key={index} className="text-sm">
                                          <div
                                            className={`p-3 rounded-lg ${
                                              item.speaker === "User"
                                                ? "bg-blue-100 ml-4"
                                                : "bg-white mr-4"
                                            }`}
                                          >
                                            <div className="flex items-center gap-2 mb-1">
                                              <span
                                                className={`font-semibold text-xs uppercase tracking-wide ${
                                                  item.speaker === "User"
                                                    ? "text-blue-700"
                                                    : "text-gray-700"
                                                }`}
                                              >
                                                {item.speaker}
                                              </span>
                                            </div>
                                            <p className="text-gray-800 leading-relaxed">
                                              {item.message}
                                            </p>
                                          </div>
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <p className="text-gray-500 text-sm text-center py-8">
                                      No transcript available
                                    </p>
                                  )}
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                              Analysis in Progress
                            </h3>
                            <p className="mt-2 text-gray-500">
                              This conversation is still being processed.
                              Summary will appear once analysis is complete.
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccessGuard>
  );
}
