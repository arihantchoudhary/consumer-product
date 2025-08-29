"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Brain, Code, Palette, Music, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export function FavoriteAgentsSection() {
  const router = useRouter();
  
  // Mock data - replace with real agent data
  const favoriteAgents = [
    { id: 1, name: "Code Assistant", icon: Code, color: "from-blue-500 to-cyan-600", path: "/agent/code" },
    { id: 2, name: "Creative Writer", icon: BookOpen, color: "from-purple-500 to-pink-600", path: "/agent/writer" },
    { id: 3, name: "Design Helper", icon: Palette, color: "from-orange-500 to-red-600", path: "/agent/design" },
    { id: 4, name: "Music Producer", icon: Music, color: "from-green-500 to-teal-600", path: "/agent/music" },
    { id: 5, name: "Research Bot", icon: Brain, color: "from-indigo-500 to-purple-600", path: "/agent/research" },
    { id: 6, name: "General Assistant", icon: Bot, color: "from-gray-500 to-gray-700", path: "/agent/general" },
  ];

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Favorite Agents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {favoriteAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => router.push(agent.path)}
              className="group relative overflow-hidden rounded-lg border border-white/20 bg-black/60 p-6 hover:bg-black/40 transition-all duration-200 hover:scale-105 hover:border-white/30"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-30 group-hover:opacity-40 transition-opacity`} />
              <div className="relative z-10 flex flex-col items-center space-y-3">
                <agent.icon className="h-8 w-8 text-white drop-shadow-lg" />
                <span className="text-white font-medium text-sm text-center">
                  {agent.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}