import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MeetingWelcomePaneProps {
  personName: string;
  onStartConversation: () => void;
}

export default function MeetingWelcomePane({ personName, onStartConversation }: MeetingWelcomePaneProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Welcome to {personName}&apos;s AI Assistant
        </CardTitle>
        <CardDescription className="text-gray-400">
          Prepare for your one-on-one with {personName} by sharing your thoughts with their AI assistant. 
          This helps build a focused agenda and makes your meeting time more productive.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">How it works:</h3>
          <ol className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span>Click the &ldquo;Talk to AI Assistant&rdquo; button to start</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span>Allow microphone access when prompted</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span>Share your meeting topics, questions, and what you&apos;d like to discuss</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span>End the conversation when you&apos;re done</span>
            </li>
          </ol>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm">
            💡 <strong>This tool helps:</strong> Build a collaborative agenda for your meeting so {personName} can prepare relevant insights and make your time together more valuable and focused.
          </p>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Get Started</h3>
          <button
            onClick={onStartConversation}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Talk to AI Assistant
          </button>
        </div>
      </CardContent>
    </Card>
  );
}