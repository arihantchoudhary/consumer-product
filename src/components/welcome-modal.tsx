"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WelcomeModalProps {
  onClose: () => void;
  personName: string;
}

export function WelcomeModal({ onClose, personName }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Welcome to {personName}&apos;s AI Assistant</h2>
        
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p className="text-lg">
            Prepare for your one-on-one with {personName} by sharing your thoughts with their AI assistant. 
            This helps build a focused agenda and makes your meeting time more productive.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ol className="space-y-2 text-sm">
              <li>1. Click the &ldquo;Talk to AI Assistant&rdquo; button to start</li>
              <li>2. Allow microphone access when prompted</li>
              <li>3. Share your meeting topics, questions, and what you&apos;d like to discuss</li>
              <li>4. End the conversation when you&apos;re done</li>
            </ol>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm">
              💡 <strong>This tool helps:</strong> Build a collaborative agenda for your meeting so {personName} can prepare relevant insights and make your time together more valuable and focused.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button onClick={onClose} size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}