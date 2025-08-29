"use client";

import { useState, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";

interface CreateAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (agentId: string) => void;
}

function CreateAgentModalContent({ open, onOpenChange, onSuccess }: CreateAgentModalProps) {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    firstMessage: "",
    systemPrompt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8001/api/agents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to create agent");
      }

      const data = await response.json();
      
      // Update user metadata with the new agent
      if (user && data.agent_id) {
        const currentMetadata = user.clientMetadata || {};
        const createdAgents = currentMetadata.created_agents || [];
        
        // Add new agent to the list
        createdAgents.push({
          id: data.agent_id,
          name: data.name,
          createdAt: new Date().toISOString(),
        });
        
        // Update user metadata
        await user.update({
          clientMetadata: {
            ...currentMetadata,
            created_agents: createdAgents,
          },
        });
        
        console.log("Updated user metadata with agent:", data.agent_id);
      }
      
      // Success
      onOpenChange(false);
      if (onSuccess) {
        onSuccess(data.agent_id);
      }
      
      // Reset form
      setFormData({
        name: "",
        firstMessage: "",
        systemPrompt: "",
      });
      
      // Refresh the page to show new agent
      router.refresh();
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Create New Agent
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Set up your AI voice agent with a name and personality
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900">Agent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Assistant"
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstMessage" className="text-gray-900">First Message</Label>
            <Textarea
              id="firstMessage"
              value={formData.firstMessage}
              onChange={(e) => setFormData({ ...formData, firstMessage: e.target.value })}
              placeholder="Hello! I'm here to help. How can I assist you today?"
              rows={3}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500">What the agent says when starting a conversation</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt" className="text-gray-900">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              placeholder="You are a helpful and friendly AI assistant..."
              rows={4}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              required
            />
            <p className="text-xs text-gray-500">Define your agent's behavior and personality</p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Agent
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateAgentModal(props: CreateAgentModalProps) {
  return <CreateAgentModalContent {...props} />;
}