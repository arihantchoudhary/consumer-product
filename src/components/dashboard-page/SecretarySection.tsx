"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, FileText, MessageSquare } from "lucide-react";

export function SecretarySection() {
  const quickActions = [
    { icon: Calendar, label: "Schedule Meeting", action: () => console.log("Schedule") },
    { icon: Mail, label: "Check Messages", action: () => console.log("Messages") },
    { icon: FileText, label: "Create Document", action: () => console.log("Document") },
    { icon: MessageSquare, label: "Start Chat", action: () => console.log("Chat") },
  ];

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">AI Secretary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-300 text-sm mb-4">
          I'm here to help you manage your day efficiently.
        </p>
        {quickActions.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            variant="outline"
            className="w-full justify-start bg-black/40 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
          >
            <action.icon className="mr-3 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}