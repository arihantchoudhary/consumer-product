"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentFriendsSection() {
  // Mock data - replace with real data later
  const recentFriends = [
    { id: 1, name: "Sarah Chen", lastInteraction: "2 hours ago", initials: "SC" },
    { id: 2, name: "Mike Johnson", lastInteraction: "Yesterday", initials: "MJ" },
    { id: 3, name: "Emma Davis", lastInteraction: "3 days ago", initials: "ED" },
    { id: 4, name: "Alex Kumar", lastInteraction: "Last week", initials: "AK" },
  ];

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Recent Friends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center space-x-3 p-3 rounded-lg bg-black/40 hover:bg-white/10 cursor-pointer transition-all border border-white/10"
          >
            <Avatar className="h-10 w-10 border-2 border-white/30">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {friend.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{friend.name}</p>
              <p className="text-gray-400 text-xs">{friend.lastInteraction}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}