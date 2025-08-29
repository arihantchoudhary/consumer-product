"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import AnimatedBackground from "@/components/animated-background";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useConversation } from "@elevenlabs/react";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
  );
}

function AgentConversationContent() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const [agentName, setAgentName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const agentId = params.agentId as string;
  
  console.log("Agent page loaded with ID:", agentId);
  
  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      toast.success("Connected! Start talking.");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      toast.success("Conversation ended");
    },
    onError: (error: unknown) => {
      console.error("ElevenLabs error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      toast.error(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onStatusChange: (status) => {
      console.log("Status changed to:", status);
    },
    onModeChange: (mode) => {
      console.log("Mode changed to:", mode);
    },
    onDebug: (message) => {
      console.log("Debug:", message);
    },
  });
  
  const { status, isSpeaking } = conversation;
  const isConnecting = status === "connecting";
  const isConnected = status === "connected";
  
  useEffect(() => {
    // Find agent name from user metadata or fetch it
    if (user) {
      const agents = user.clientMetadata?.created_agents || [];
      const agent = agents.find((a: { id: string; name: string }) => a.id === agentId);
      if (agent) {
        setAgentName(agent.name);
      } else {
        setAgentName("AI Assistant");
      }
      setIsLoading(false);
    } else if (user === null) {
      // User is not authenticated
      router.push("/sign-in");
    }
    
    // Log agent ID for debugging
    console.log("Agent page loaded with ID:", agentId);
    console.log("Current conversation status:", status);
    console.log("User:", user);
  }, [user, agentId, status, router]);
  
  const startConversation = async () => {
    try {
      console.log("Starting conversation with agent ID:", agentId);
      
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
      
      // Start the conversation with agent ID
      const sessionId = await conversation.startSession({
        agentId: agentId,
        connectionType: "webrtc", // Use WebRTC for better audio quality
      });
      console.log("Conversation started with session ID:", sessionId);
    } catch (error) {
      console.error("Error starting conversation:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        agentId: agentId,
        error: error
      });
      if (error instanceof Error && error.message.includes("microphone")) {
        toast.error("Microphone access denied. Please check permissions.");
      } else {
        toast.error(`Failed to start conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
  
  const stopConversation = async () => {
    await conversation.endSession();
  };
  
  const toggleConversation = () => {
    if (isConnected) {
      stopConversation();
    } else {
      startConversation();
    }
  };
  
  // Get status text
  const getStatusText = () => {
    if (isConnecting) return "Connecting...";
    if (isConnected && isSpeaking) return "Agent is speaking...";
    if (isConnected && !isSpeaking) return "Listening...";
    return "Tap to talk";
  };
  
  // Show loading while checking user auth
  if (isLoading || user === undefined) {
    return <LoadingSpinner />;
  }
  
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Card with Mic Button */}
            <div className="flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 w-full max-w-md">
                <div className="text-center space-y-8">
                  {/* Agent Name */}
                  <h1 className="text-3xl font-bold text-gray-900">
                    {agentName}
                  </h1>
                  
                  {/* Microphone Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={toggleConversation}
                      disabled={isConnecting}
                      className={`
                        relative w-32 h-32 rounded-full flex items-center justify-center
                        transition-all duration-300 transform
                        ${isConnecting ? 'scale-95 opacity-50' : ''}
                        ${isConnected ? 'scale-110' : 'hover:scale-105'}
                        ${isConnected 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-blue-500 hover:bg-blue-600'
                        }
                        shadow-lg hover:shadow-xl
                        disabled:cursor-not-allowed
                      `}
                    >
                      {isConnecting ? (
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                      ) : isConnected ? (
                        <MicOff className="h-12 w-12 text-white" />
                      ) : (
                        <Mic className="h-12 w-12 text-white" />
                      )}
                      
                      {/* Pulse animation when connected */}
                      {isConnected && (
                        <>
                          <span className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping" />
                          <span className="absolute inset-0 rounded-full bg-red-500 opacity-50 animate-ping animation-delay-200" />
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Status Text */}
                  <p className="text-gray-600 text-lg">
                    {getStatusText()}
                  </p>
                  
                  {/* Visual Feedback - Audio Waveform */}
                  {isConnected && (
                    <div className="flex justify-center items-center space-x-1 h-12">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`
                            w-1 bg-blue-500 rounded-full transition-all duration-300
                            ${isSpeaking ? 'animate-pulse' : ''}
                          `}
                          style={{
                            height: isSpeaking 
                              ? `${Math.random() * 30 + 20}px` 
                              : '4px',
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Connection Status */}
                  <div className="text-sm text-gray-500">
                    Status: <span className="font-medium">{status}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Instructions Pane */}
            <div className="flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Start Conversation</h3>
                      <p className="text-sm text-gray-600">Click the microphone button to begin talking with your AI agent.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Speak Naturally</h3>
                      <p className="text-sm text-gray-600">Talk to your agent as you would in a normal conversation. The AI will respond in real-time.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">End Conversation</h3>
                      <p className="text-sm text-gray-600">Click the microphone button again to end the conversation when you&apos;re done.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Make sure your microphone is enabled and you have a stable internet connection for the best experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AgentConversationPage() {
  return <AgentConversationContent />;
}