"use client";

import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUser } from "@stackframe/stack";
import { Textarea } from "@/components/ui/textarea";

export function BackgroundSettingsModal() {
  const [open, setOpen] = useState(false);
  const [editableMetadata, setEditableMetadata] = useState("");
  const [error, setError] = useState("");
  const user = useUser();

  useEffect(() => {
    if (user?.clientMetadata) {
      setEditableMetadata(JSON.stringify(user.clientMetadata, null, 2));
    }
  }, [user?.clientMetadata]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(editableMetadata);
      if (user) {
        await user.update({ clientMetadata: parsed });
        setError("");
        setOpen(false);
      }
    } catch {
      setError("Invalid JSON format");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-black/90 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">User Metadata</DialogTitle>
          <DialogDescription className="text-gray-400">
            Edit your client metadata (JSON format)
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-2">Email: {user?.primaryEmail || "Not logged in"}</p>
              <p className="text-gray-300 mb-2">User ID: {user?.id || "N/A"}</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-2">Client Metadata (Editable):</h3>
              <Textarea
                value={editableMetadata}
                onChange={(e) => {
                  setEditableMetadata(e.target.value);
                  setError("");
                }}
                className="bg-white/10 border-white/20 text-white font-mono text-sm min-h-[300px] placeholder-gray-500"
                placeholder="{}"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setEditableMetadata(JSON.stringify(user?.clientMetadata || {}, null, 2));
              setError("");
            }}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="bg-white text-black hover:bg-gray-200"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}