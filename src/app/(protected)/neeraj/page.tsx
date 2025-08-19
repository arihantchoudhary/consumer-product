"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X, Settings } from "lucide-react";
import Image from "next/image";
import AnimatedBackground from "@/components/animated-background";
import { useConversation } from "@elevenlabs/react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import AccessGuard from "@/components/access-guard";

export default function NeerajPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showMicPanel, setShowMicPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [effectType, setEffectType] = useState<'soundWave' | 'breathing' | 'recordingDots' | 'borderGlow' | 'ripple' | 'bounce' | 'cornerAccents' | 'orbit' | 'matrix' | 'heartbeat' | 'typewriter' | 'spiral'>('soundWave');
  const [isConversationActive, setIsConversationActive] = useState(false);

  const user = useUser();
  const router = useRouter();

  // This is Neeraj's page
  const pageName = "Neeraj";

  const conversation = useConversation({
    onConnect: () => {
      console.log(`Connected to ${pageName}`);
      setIsConversationActive(true);
    },
    onDisconnect: () => {
      console.log(`Disconnected from ${pageName}`);
      setIsConversationActive(false);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      setIsConversationActive(false);
    },
    onMessage: (message) => {
      console.log(`Message from ${pageName}:`, message);
    },
    onDebug: (debugInfo) => {
      console.log(`Debug info from ${pageName}:`, debugInfo);
    },
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setShowMicPanel(true);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const startConversation = async () => {
    try {
      // Neeraj's agent ID
      const agentId = "agent_0501k30qjpw9fbharan0mmt0sj03";
      
      await conversation.startSession({
        agentId,
        connectionType: "webrtc" as const,
      });
    } catch (error) {
      console.error(`Failed to start conversation with ${pageName}:`, error);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error(`Failed to end conversation with ${pageName}:`, error);
    }
  };

  const scrollToCalendar = () => {
    document.getElementById('calendar-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleSignOut = async () => {
    if (user) {
      await user.signOut();
    }
    router.push("/sign-in");
  };

  return (
    <AccessGuard requiredPage="neeraj">
      <AnimatedBackground />
      
      {/* Sign Out Button */}
      <div className="fixed top-4 right-4 z-20">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          Sign Out
        </Button>
      </div>
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="bg-black rounded-lg border border-black shadow-2xl p-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
              Voice Assistant with {pageName}
            </h1>
            
            <Button
              onClick={scrollToCalendar}
              size="lg"
              className="w-full max-w-md mx-auto"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar-section" className="relative z-10 min-h-screen flex items-center justify-center p-8 overflow-hidden">
      <div className="flex w-full max-w-6xl h-[600px] relative">
        {/* Calendar Section */}
        <div 
          className={`transition-all duration-500 ease-in-out ${
            showMicPanel ? 'w-1/2' : 'w-full'
          }`}
        >
          <div className="bg-black rounded-lg border border-black shadow-2xl p-8 h-full flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-center mb-4 text-white">
              {pageName}
            </h1>
            <p className="text-center text-gray-300 text-sm mb-6">
              Select a date to start chatting
            </p>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-lg shadow-md [--cell-size:48px] bg-white border border-gray-300"
              />
            </div>
            {date && !showMicPanel && (
              <p className="text-center mt-4 text-sm text-gray-300">
                Selected: {formatDate(date)}
              </p>
            )}
          </div>
        </div>

        {/* Mic Panel */}
        <div 
          className={`transition-all duration-500 ease-in-out ${
            showMicPanel ? 'w-1/2 translate-x-0' : 'w-0 translate-x-full'
          } overflow-hidden`}
        >
          <div className="bg-black rounded-lg border border-black shadow-2xl p-6 h-full ml-4 flex flex-col relative">
            {/* Header with close and settings */}
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMicPanel(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
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
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">
                  Prepare for our 1:1
                </h2>
                <p className="text-sm text-gray-300">
                  {formatDate(date)}
                </p>
              </div>
              
              <div className="relative flex items-center justify-center" style={{ minHeight: '160px' }}>
                {/* Sound Wave Animation */}
                {effectType === 'soundWave' && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`absolute w-24 h-24 rounded-full border animate-ping ${
                        isConversationActive ? 'border-green-400/80' : 'border-blue-400/60'
                      }`} style={{ 
                        animationDuration: isConversationActive && conversation.isSpeaking ? '0.5s' : '1s' 
                      }}></div>
                      <div className={`absolute w-28 h-28 rounded-full border animate-ping ${
                        isConversationActive ? 'border-green-300/70' : 'border-purple-400/50'
                      }`} style={{ 
                        animationDuration: isConversationActive && conversation.isSpeaking ? '0.8s' : '1.5s',
                        animationDelay: '0.3s' 
                      }}></div>
                      <div className={`absolute w-32 h-32 rounded-full border animate-ping ${
                        isConversationActive ? 'border-green-200/60' : 'border-pink-400/40'
                      }`} style={{ 
                        animationDuration: isConversationActive && conversation.isSpeaking ? '1s' : '2s',
                        animationDelay: '0.6s' 
                      }}></div>
                    </div>
                  </>
                )}

                {/* Other animation effects... (keeping them all) */}
                {effectType === 'breathing' && (
                  <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 animate-pulse" style={{ animationDuration: '2s' }}></div>
                )}

                {effectType === 'recordingDots' && (
                  <div className="absolute w-32 h-32 flex items-center justify-center">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                      const angle = (i * Math.PI * 2) / 8;
                      const radius = 35;
                      const x = 50 + radius * Math.cos(angle);
                      const y = 50 + radius * Math.sin(angle);
                      return (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-red-500 rounded-full"
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
                  <div className="absolute w-28 h-28 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500/30 via-transparent to-purple-500/30 animate-spin" style={{ animationDuration: '2s' }}></div>
                )}

                {effectType === 'ripple' && (
                  <div className="absolute w-24 h-24 rounded-full border-2 border-cyan-400/50 animate-ping"></div>
                )}
                
                {effectType === 'cornerAccents' && (
                  <div className="absolute w-32 h-32 flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-yellow-400/60 animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-yellow-400/60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-yellow-400/60 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-yellow-400/60 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                )}

                {effectType === 'orbit' && (
                  <div className="absolute w-32 h-32 flex items-center justify-center">
                    <div className="absolute w-2 h-2 bg-blue-500 rounded-full" style={{ 
                      animation: 'orbit-outer 3s linear infinite',
                      transformOrigin: '64px 64px'
                    }}></div>
                    <div className="absolute w-2 h-2 bg-purple-500 rounded-full" style={{ 
                      animation: 'orbit-inner 2s linear infinite reverse',
                      transformOrigin: '48px 48px'
                    }}></div>
                    <div className="absolute w-1 h-1 bg-cyan-400 rounded-full" style={{ 
                      animation: 'orbit-fast 1.5s linear infinite',
                      transformOrigin: '32px 32px'
                    }}></div>
                  </div>
                )}

                {effectType === 'matrix' && (
                  <div className="absolute w-32 h-32 flex items-center justify-center overflow-hidden">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
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
                  <div className="absolute w-32 h-32 flex items-center justify-center">
                    <div className="absolute w-20 h-20 rounded-full bg-red-500/20" style={{
                      animation: 'heartbeat 1.2s ease-in-out infinite'
                    }}></div>
                    <div className="absolute w-16 h-16 rounded-full bg-red-400/30" style={{
                      animation: 'heartbeat 1.2s ease-in-out infinite',
                      animationDelay: '0.1s'
                    }}></div>
                    <div className="absolute w-12 h-12 rounded-full bg-red-300/40" style={{
                      animation: 'heartbeat 1.2s ease-in-out infinite',
                      animationDelay: '0.2s'
                    }}></div>
                  </div>
                )}

                {effectType === 'typewriter' && (
                  <div className="absolute w-32 h-8 flex items-center justify-center">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-blue-400 rounded-full"
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
                  <div className="absolute w-32 h-32 flex items-center justify-center">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                      const radius = 4 + i * 6;
                      const angle = (i * Math.PI) / 4;
                      const x = 50 + (radius * Math.cos(angle));
                      const y = 50 + (radius * Math.sin(angle));
                      return (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-indigo-500 rounded-full"
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
                
                <Button
                  size="icon"
                  onClick={isConversationActive ? endConversation : startConversation}
                  disabled={conversation.status === "connecting"}
                  className={`relative w-24 h-24 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 z-10 p-0 ${
                    effectType === 'bounce' ? 'animate-bounce' : ''
                  } ${
                    isConversationActive ? 'ring-4 ring-green-400 ring-opacity-75' : ''
                  } ${
                    conversation.status === "connecting" ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''
                  }`}
                >
                  <Image
                    src="/neeraj.png"
                    alt={pageName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                  {isConversationActive && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                  )}
                  {conversation.status === "connecting" && (
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse" />
                  )}
                </Button>
              </div>
              
              <div className="text-gray-300 text-sm max-w-48 text-center">
                {conversation.status === "connecting" ? (
                  <p>Connecting to {pageName}...</p>
                ) : isConversationActive ? (
                  <div>
                    <p className="text-green-400 font-medium">Talking with {pageName}</p>
                    <p className="text-gray-400 text-xs mt-1">Click to end</p>
                  </div>
                ) : (
                  <p>Click to start talking with {pageName}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
      
      {/* Custom Styles */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .scroll-section {
          scroll-snap-align: start;
        }

        @keyframes orbit-outer {
          0% {
            transform: rotate(0deg) translate(64px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(64px) rotate(-360deg);
          }
        }

        @keyframes orbit-inner {
          0% {
            transform: rotate(0deg) translate(48px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(48px) rotate(-360deg);
          }
        }

        @keyframes orbit-fast {
          0% {
            transform: rotate(0deg) translate(32px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(32px) rotate(-360deg);
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