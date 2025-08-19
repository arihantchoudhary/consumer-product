"use client";

import { useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Square, Settings } from "lucide-react";
import AccessGuard from "@/components/access-guard";
import AnimatedBackground from "@/components/animated-background";
import MeetingWelcomePane from "@/components/meeting-welcome-pane";

export default function GuyPage() {
  const AGENT_ID = "agent_3001k3119h2vfzpvfxxc3d8tn8b6";
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [effectType, setEffectType] = useState<'soundWave' | 'breathing' | 'recordingDots' | 'borderGlow' | 'ripple' | 'bounce' | 'cornerAccents' | 'orbit' | 'matrix' | 'heartbeat' | 'typewriter' | 'spiral'>('soundWave');
  const [isConversationActive, setIsConversationActive] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("AI Assistant Connected");
      setError(null);
      setIsConversationActive(true);
    },
    onDisconnect: () => {
      console.log("AI Assistant Disconnected");
      setIsConversationActive(false);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      setError("Failed to connect to AI assistant. Please try again.");
      setIsConversationActive(false);
    },
    onMessage: (message) => {
      console.log("Message from Guy:", message);
    },
    onDebug: (debugInfo) => {
      console.log("Debug info from Guy:", debugInfo);
    },
  });

  const handleStartConversation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowWelcome(false);
      
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start conversation with the agent
      await conversation.startSession({ 
        agentId: AGENT_ID,
        connectionType: "websocket" as const
      });
      
    } catch (error) {
      setError("Please allow microphone access to use the voice assistant.");
      console.error("Error starting conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndConversation = async () => {
    await conversation.endSession();
  };

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  if (showWelcome) {
    return (
      <AccessGuard requiredPage="guy">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <MeetingWelcomePane 
            personName="Guy Ruttenberg"
            onStartConversation={handleStartConversation}
          />
        </div>
      </AccessGuard>
    );
  }

  return (
    <AccessGuard requiredPage="guy">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-black rounded-lg border border-black shadow-2xl p-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
              Guy Ruttenberg
            </h1>
            
            {/* Settings Panel */}
            {showSettings && (
              <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-white mb-3">Animation Effects</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['soundWave', 'breathing', 'recordingDots', 'borderGlow', 'ripple', 'bounce', 'cornerAccents', 'orbit', 'matrix', 'heartbeat', 'typewriter', 'spiral'] as const).map((effect) => (
                    <Button
                      key={effect}
                      variant={effectType === effect ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEffectType(effect)}
                      className="text-xs h-8"
                    >
                      {effect.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Main Button with Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative flex items-center justify-center" style={{ minHeight: '200px', minWidth: '200px' }}>
                {/* Animation Effects */}
                {effectType === 'soundWave' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`absolute w-32 h-32 rounded-full border animate-ping ${
                      isConversationActive ? 'border-green-400/80' : 'border-blue-400/60'
                    }`} style={{ 
                      animationDuration: isConversationActive && conversation.isSpeaking ? '0.5s' : '1s' 
                    }}></div>
                    <div className={`absolute w-36 h-36 rounded-full border animate-ping ${
                      isConversationActive ? 'border-green-300/70' : 'border-purple-400/50'
                    }`} style={{ 
                      animationDuration: isConversationActive && conversation.isSpeaking ? '0.8s' : '1.5s',
                      animationDelay: '0.3s' 
                    }}></div>
                    <div className={`absolute w-40 h-40 rounded-full border animate-ping ${
                      isConversationActive ? 'border-green-200/60' : 'border-pink-400/40'
                    }`} style={{ 
                      animationDuration: isConversationActive && conversation.isSpeaking ? '1s' : '2s',
                      animationDelay: '0.6s' 
                    }}></div>
                  </div>
                )}
                
                {effectType === 'breathing' && (
                  <div className="absolute w-32 h-32 rounded-full bg-blue-500/20 animate-pulse" style={{ animationDuration: '2s' }}></div>
                )}
                
                {effectType === 'recordingDots' && (
                  <div className="absolute w-40 h-40 flex items-center justify-center">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                      const angle = (i * Math.PI * 2) / 8;
                      const radius = 50;
                      const x = 50 + radius * Math.cos(angle);
                      const y = 50 + radius * Math.sin(angle);
                      return (
                        <div
                          key={i}
                          className="absolute w-4 h-4 bg-red-500 rounded-full"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            animation: `pulse 1.5s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      );
                    })}
                  </div>
                )}
                
                {effectType === 'borderGlow' && (
                  <div className="absolute w-36 h-36 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-transparent to-purple-500/30 animate-spin" style={{ animationDuration: '2s' }}></div>
                )}
                
                {effectType === 'ripple' && (
                  <div className="absolute w-32 h-32 rounded-full border-2 border-cyan-400/50 animate-ping"></div>
                )}
                
                {effectType === 'bounce' && (
                  <div className="absolute w-32 h-32 rounded-full bg-blue-500/20 animate-bounce"></div>
                )}
                
                {effectType === 'cornerAccents' && (
                  <div className="absolute w-40 h-40 flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-yellow-400/60 animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-yellow-400/60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-yellow-400/60 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-yellow-400/60 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                )}
                
                {effectType === 'orbit' && (
                  <div className="absolute w-40 h-40 flex items-center justify-center">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full" style={{ 
                      animation: 'orbit-outer 3s linear infinite',
                      transformOrigin: '80px 80px'
                    }}></div>
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full" style={{ 
                      animation: 'orbit-inner 2s linear infinite reverse',
                      transformOrigin: '60px 60px'
                    }}></div>
                    <div className="absolute w-2 h-2 bg-cyan-400 rounded-full" style={{ 
                      animation: 'orbit-fast 1.5s linear infinite',
                      transformOrigin: '40px 40px'
                    }}></div>
                  </div>
                )}
                
                {effectType === 'matrix' && (
                  <div className="absolute w-40 h-40 flex items-center justify-center overflow-hidden">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div
                        key={i}
                        className="absolute w-1 bg-green-400 opacity-70"
                        style={{
                          height: `${20 + (i * 7) % 30}px`,
                          left: `${15 + i * 10}%`,
                          animation: 'matrix-fall 2s linear infinite',
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {effectType === 'heartbeat' && (
                  <div className="absolute w-40 h-40 flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full bg-red-500/20" style={{
                      animation: 'heartbeat 1.2s ease-in-out infinite'
                    }}></div>
                    <div className="absolute w-20 h-20 rounded-full bg-red-400/30" style={{
                      animation: 'heartbeat 1.2s ease-in-out infinite',
                      animationDelay: '0.1s'
                    }}></div>
                    <div className="absolute w-16 h-16 rounded-full bg-red-300/40" style={{
                      animation: 'heartbeat 1.2s ease-in-out infinite',
                      animationDelay: '0.2s'
                    }}></div>
                  </div>
                )}
                
                {effectType === 'typewriter' && (
                  <div className="absolute w-40 h-12 flex items-center justify-center">
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-4 h-4 bg-blue-400 rounded-full"
                          style={{
                            animation: `bounce 1.4s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {effectType === 'spiral' && (
                  <div className="absolute w-40 h-40 flex items-center justify-center">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                      const radius = 6 + i * 8;
                      const angle = (i * Math.PI) / 4;
                      const x = 50 + (radius * Math.cos(angle));
                      const y = 50 + (radius * Math.sin(angle));
                      return (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-indigo-500 rounded-full"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            animation: `spiral 3s ease-out infinite`,
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
                      );
                    })}
                  </div>
                )}
                
                {/* Main Button */}
                <Button
                  size="icon"
                  onClick={isConnected ? handleEndConversation : handleStartConversation}
                  disabled={isLoading}
                  className={`relative w-32 h-32 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-10 ${
                    isConnected ? 'ring-4 ring-green-400 ring-opacity-75 bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  } ${
                    isLoading ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse bg-yellow-600' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white" />
                  ) : isConnected ? (
                    <Square className="w-16 h-16 text-white" />
                  ) : (
                    <MessageCircle className="w-16 h-16 text-white" />
                  )}
                  {isConnected && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Status Text */}
            <div className="text-gray-300 text-base mb-6">
              {isLoading ? (
                <p>Connecting...</p>
              ) : isConnected ? (
                <div>
                  <p className="text-green-400 font-medium">Connected</p>
                  <p className="text-gray-400 text-sm mt-1">{isSpeaking ? "Speaking..." : "Listening..."}</p>
                </div>
              ) : (
                <p>Click to start</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="sm"
                className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Effects
              </Button>
              
              <Button
                onClick={() => setShowWelcome(true)}
                variant="outline"
                size="sm"
                className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
              >
                Back to Welcome
              </Button>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-md mx-auto mb-6">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes orbit-outer {
          0% {
            transform: rotate(0deg) translate(80px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(80px) rotate(-360deg);
          }
        }

        @keyframes orbit-inner {
          0% {
            transform: rotate(0deg) translate(60px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(60px) rotate(-360deg);
          }
        }

        @keyframes orbit-fast {
          0% {
            transform: rotate(0deg) translate(40px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(40px) rotate(-360deg);
          }
        }

        @keyframes matrix-fall {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }

        @keyframes heartbeat {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          14% {
            transform: scale(1.3);
            opacity: 1;
          }
          28% {
            transform: scale(1);
            opacity: 0.8;
          }
          42% {
            transform: scale(1.3);
            opacity: 1;
          }
          70% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @keyframes spiral {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </AccessGuard>
  );
}