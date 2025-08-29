"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Phone, Clock, Sparkles, Settings, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { useState } from "react";
import { toast } from "sonner";

export function SecretarySection() {
  const router = useRouter();
  const user = useUser();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupData, setSetupData] = useState({
    name: "",
    firstMessage: "Hello! I'm your AI secretary. How can I help you today?",
    systemPrompt: "You are a professional AI secretary. Help with scheduling, task management, and general administrative support. Be helpful, organized, and proactive."
  });
  
  // Check if secretary is configured in user metadata
  const secretaryConfig = user?.clientMetadata?.secretary;
  
  const handleSetupSecretary = async () => {
    if (!setupData.name.trim()) {
      toast.error("Please enter a name for your secretary");
      return;
    }
    
    setIsSettingUp(true);
    
    try {
      // Create the secretary agent
      const response = await fetch("http://localhost:8001/api/agents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          name: setupData.name,
          firstMessage: setupData.firstMessage,
          systemPrompt: setupData.systemPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create secretary");
      }

      const data = await response.json();
      
      // Update user metadata with secretary configuration
      if (user && data.agent_id) {
        const currentMetadata = user.clientMetadata || {};
        
        await user.update({
          clientMetadata: {
            ...currentMetadata,
            secretary: {
              id: data.agent_id,
              name: setupData.name,
              createdAt: new Date().toISOString(),
            },
          },
        });
        
        toast.success(`${setupData.name} is now your AI secretary!`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating secretary:", error);
      toast.error("Failed to setup secretary. Please try again.");
    } finally {
      setIsSettingUp(false);
    }
  };
  
  // If secretary is not configured, show setup pane
  if (!secretaryConfig) {
    return (
      <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-gray-900">Setup Your AI Secretary</CardTitle>
            <Settings className="h-5 w-5 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <div className="text-center space-y-3">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900">Create Your Personal AI Coworker</h3>
              <p className="text-gray-600 text-sm max-w-xl mx-auto">
                Set up your AI secretary to help manage your daily tasks. Give them a name and personality!
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretary-name" className="text-gray-900">Secretary Name</Label>
              <Input
                id="secretary-name"
                value={setupData.name}
                onChange={(e) => setSetupData({ ...setupData, name: e.target.value })}
                placeholder="e.g., Sarah, Alex, Assistant"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                disabled={isSettingUp}
              />
              <p className="text-xs text-gray-500">Choose a name for your AI coworker</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="first-message" className="text-gray-900">Greeting Message</Label>
              <Textarea
                id="first-message"
                value={setupData.firstMessage}
                onChange={(e) => setSetupData({ ...setupData, firstMessage: e.target.value })}
                rows={2}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                disabled={isSettingUp}
              />
              <p className="text-xs text-gray-500">What your secretary says when starting a conversation</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personality" className="text-gray-900">Personality & Role</Label>
              <Textarea
                id="personality"
                value={setupData.systemPrompt}
                onChange={(e) => setSetupData({ ...setupData, systemPrompt: e.target.value })}
                rows={3}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                disabled={isSettingUp}
              />
              <p className="text-xs text-gray-500">Define your secretary&apos;s personality and capabilities</p>
            </div>
            
            <Button
              onClick={handleSetupSecretary}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg"
              disabled={isSettingUp}
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Secretary...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create My Secretary
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If secretary is configured, show the normal secretary interface
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            {secretaryConfig.name || "AI Secretary"}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Available 24/7</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
          <div className="text-center space-y-4">
            <Sparkles className="h-12 w-12 text-purple-600 mx-auto" />
            <h3 className="text-xl font-medium text-gray-900">
              Hi! I&apos;m {secretaryConfig.name}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              I&apos;m your AI-powered secretary, ready to help you manage tasks, schedule meetings, 
              organize documents, and streamline your workflow. Choose how you&apos;d like to interact with me.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <Button
            onClick={() => console.log("Listen mode")}
            className="h-32 flex-col gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
          >
            <Mic className="h-10 w-10" />
            <div>
              <div className="text-lg font-semibold">Listen</div>
              <div className="text-sm opacity-90">I&apos;ll listen and help</div>
            </div>
          </Button>
          
          <Button
            onClick={() => router.push(`/agent/${secretaryConfig.id}`)}
            className="h-32 flex-col gap-3 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
          >
            <Phone className="h-10 w-10" />
            <div>
              <div className="text-lg font-semibold">Talk to {secretaryConfig.name}</div>
              <div className="text-sm opacity-90">Have a conversation</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}