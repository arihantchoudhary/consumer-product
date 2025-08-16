"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Loader2,
  FileText,
  Users,
  Target,
  AlertCircle,
  CheckSquare,
  MessageSquare,
  ClipboardList,
  Calendar,
  Copy,
  Download,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Save,
  X
} from "lucide-react";

interface TranscriptAnalyzerProps {
  onBack: () => void;
}

interface ProcessedData {
  [key: string]: string;
  timestamp: string;
  originalTranscript: string;
}

interface BlockConfig {
  key: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  prompt: string;
  enabled: boolean;
  isCustom?: boolean;
}

const DEFAULT_PROMPTS = {
  summary: "List 3 key points from this conversation. One short line each:\n- Point 1\n- Point 2\n- Point 3",
  agenda: "List top 3 topics discussed. One line each:\n- Topic 1\n- Topic 2\n- Topic 3",
  participants: "List people mentioned (max 3). Format: Name - Role (5 words max each)",
  goals: "List 3 main goals. One line each, under 10 words per goal.",
  challenges: "List 3 main problems. One line each, under 10 words.",
  actionItems: "List 3 next steps. One line each, under 10 words.",
  feedback: "List 3 feedback points. One line each, under 10 words.",
  meetingNeed: "Should a meeting happen? Answer: YES/NO - reason (one line only)"
};

export function TranscriptAnalyzer({ onBack }: TranscriptAnalyzerProps) {
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [newBlockTitle, setNewBlockTitle] = useState("");
  const [newBlockPrompt, setNewBlockPrompt] = useState("");
  
  const [blocks, setBlocks] = useState<BlockConfig[]>([
    { 
      key: 'summary', 
      title: 'Executive Summary', 
      icon: <FileText className="h-5 w-5" />, 
      description: 'Key points from conversation',
      prompt: DEFAULT_PROMPTS.summary,
      enabled: true
    },
    { 
      key: 'agenda', 
      title: 'Meeting Agenda', 
      icon: <ClipboardList className="h-5 w-5" />, 
      description: 'Topics discussed',
      prompt: DEFAULT_PROMPTS.agenda,
      enabled: true
    },
    { 
      key: 'participants', 
      title: 'Participants', 
      icon: <Users className="h-5 w-5" />, 
      description: 'People mentioned',
      prompt: DEFAULT_PROMPTS.participants,
      enabled: false
    },
    { 
      key: 'goals', 
      title: 'Goals', 
      icon: <Target className="h-5 w-5" />, 
      description: 'Objectives discussed',
      prompt: DEFAULT_PROMPTS.goals,
      enabled: true
    },
    { 
      key: 'challenges', 
      title: 'Challenges', 
      icon: <AlertCircle className="h-5 w-5" />, 
      description: 'Problems identified',
      prompt: DEFAULT_PROMPTS.challenges,
      enabled: true
    },
    { 
      key: 'actionItems', 
      title: 'Action Items', 
      icon: <CheckSquare className="h-5 w-5" />, 
      description: 'Next steps',
      prompt: DEFAULT_PROMPTS.actionItems,
      enabled: true
    },
    { 
      key: 'feedback', 
      title: 'Feedback', 
      icon: <MessageSquare className="h-5 w-5" />, 
      description: 'Feedback points',
      prompt: DEFAULT_PROMPTS.feedback,
      enabled: false
    },
    { 
      key: 'meetingNeed', 
      title: 'Meeting Decision', 
      icon: <Calendar className="h-5 w-5" />, 
      description: 'Should a meeting happen?',
      prompt: DEFAULT_PROMPTS.meetingNeed,
      enabled: true
    },
  ]);

  const toggleBlock = (key: string) => {
    setBlocks(prev => prev.map(block => 
      block.key === key ? { ...block, enabled: !block.enabled } : block
    ));
  };

  const updateBlockPrompt = (key: string, newPrompt: string) => {
    setBlocks(prev => prev.map(block => 
      block.key === key ? { ...block, prompt: newPrompt } : block
    ));
  };

  const deleteBlock = (key: string) => {
    setBlocks(prev => prev.filter(block => block.key !== key));
  };

  const addCustomBlock = () => {
    if (!newBlockTitle.trim() || !newBlockPrompt.trim()) return;
    
    const newBlock: BlockConfig = {
      key: `custom_${Date.now()}`,
      title: newBlockTitle,
      icon: <FileText className="h-5 w-5" />,
      description: 'Custom analysis',
      prompt: newBlockPrompt,
      enabled: true,
      isCustom: true
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setNewBlockTitle("");
    setNewBlockPrompt("");
    setShowAddBlock(false);
  };

  const processTranscript = async () => {
    if (!transcript.trim()) {
      setError("Please paste a transcript first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get only enabled blocks with their prompts
      const enabledBlocks = blocks.filter(b => b.enabled);
      
      const response = await fetch('/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transcript,
          customBlocks: enabledBlocks.map(b => ({
            key: b.key,
            prompt: b.prompt
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process transcript');
      }

      const data = await response.json();
      setProcessedData(data);
    } catch (err) {
      setError('Failed to process transcript. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, sectionKey?: string) => {
    navigator.clipboard.writeText(text);
    if (sectionKey) {
      setCopiedSection(sectionKey);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const downloadResults = () => {
    if (!processedData) return;
    
    let resultsText = `Meeting Analysis - ${processedData.timestamp}\n=====================================\n\n`;
    
    blocks.forEach(block => {
      if (block.enabled && processedData[block.key]) {
        resultsText += `${block.title.toUpperCase()}\n${'-'.repeat(block.title.length)}\n`;
        resultsText += `${processedData[block.key]}\n\n`;
      }
    });
    
    resultsText += `\nORIGINAL TRANSCRIPT\n-------------------\n${processedData.originalTranscript}`;

    const element = document.createElement("a");
    const file = new Blob([resultsText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `meeting-analysis-${new Date().toISOString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sendEmail = () => {
    if (!processedData) return;
    
    const subject = encodeURIComponent('Meeting Request Analysis');
    let body = 'Meeting Analysis Results\n\n';
    
    blocks.forEach(block => {
      if (block.enabled && processedData[block.key]) {
        body += `${block.title}:\n${processedData[block.key]}\n\n`;
      }
    });
    
    window.location.href = `mailto:sajjad@example.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const resetAnalysis = () => {
    setProcessedData(null);
    setTranscript("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      
      <div className="max-w-7xl mx-auto pt-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Transcript Analyzer</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Paste your transcript, customize prompts, and generate analysis
            </p>
          </div>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {!processedData ? (
          <>
            {/* Transcript Input */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Conversation Transcript</CardTitle>
                <CardDescription>
                  Paste your transcript from ElevenLabs or any other source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste your conversation transcript here..."
                  className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {transcript.length} characters
                </div>
              </CardContent>
            </Card>

            {/* Block Selection with Editable Prompts */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Analysis Blocks</CardTitle>
                    <CardDescription>
                      Select blocks and customize their prompts
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowAddBlock(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Block
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add New Block Form */}
                {showAddBlock && (
                  <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Block Title"
                        value={newBlockTitle}
                        onChange={(e) => setNewBlockTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <textarea
                        placeholder="Enter prompt for AI (e.g., 'List 3 key decisions. One line each.')"
                        value={newBlockPrompt}
                        onChange={(e) => setNewBlockPrompt(e.target.value)}
                        className="w-full h-24 p-2 border rounded resize-none"
                      />
                      <div className="flex gap-2">
                        <Button onClick={addCustomBlock} size="sm">
                          <Save className="mr-2 h-3 w-3" />
                          Add
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowAddBlock(false);
                            setNewBlockTitle("");
                            setNewBlockPrompt("");
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {blocks.map((block) => (
                    <div
                      key={block.key}
                      className={`p-4 border rounded-lg transition-all ${
                        block.enabled 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={block.enabled}
                          onChange={() => toggleBlock(block.key)}
                          className="mt-1"
                        />
                        <div className={`p-2 rounded-lg ${
                          block.enabled ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          {block.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{block.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {block.description}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => setEditingBlock(editingBlock === block.key ? null : block.key)}
                                size="sm"
                                variant="ghost"
                              >
                                {editingBlock === block.key ? <X className="h-3 w-3" /> : <Edit2 className="h-3 w-3" />}
                              </Button>
                              {block.isCustom && (
                                <Button
                                  onClick={() => deleteBlock(block.key)}
                                  size="sm"
                                  variant="ghost"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {editingBlock === block.key && (
                            <div className="mt-3">
                              <textarea
                                value={block.prompt}
                                onChange={(e) => updateBlockPrompt(block.key, e.target.value)}
                                className="w-full h-24 p-2 text-sm border rounded resize-none"
                                placeholder="Enter prompt for AI..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Process Button */}
            <div className="flex justify-center">
              <Button
                onClick={processTranscript}
                disabled={isProcessing || !transcript.trim() || blocks.filter(b => b.enabled).length === 0}
                size="lg"
                className="min-w-[200px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Transcript
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Results Display */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <div className="flex gap-3">
                <Button onClick={downloadResults} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={sendEmail} variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button onClick={resetAnalysis}>
                  New Analysis
                </Button>
              </div>
            </div>

            {/* Meeting Recommendation (if present) */}
            {processedData.meetingNeed && (
              <Card className={`mb-6 ${
                processedData.meetingNeed.toLowerCase().includes('yes')
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Meeting Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{processedData.meetingNeed}</p>
                  {processedData.meetingNeed.toLowerCase().includes('yes') && (
                    <Button 
                      onClick={() => window.open('https://calendly.com/sajjad', '_blank')}
                      className="w-full sm:w-auto"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Meeting with Sajjad
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Analysis Results Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {blocks.filter(b => b.enabled && b.key !== 'meetingNeed').map((block) => {
                const content = processedData[block.key];
                if (!content) return null;
                
                return (
                  <Card key={block.key} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {block.icon}
                          {block.title}
                        </span>
                        <Button
                          onClick={() => copyToClipboard(content, block.key)}
                          size="sm"
                          variant="ghost"
                        >
                          {copiedSection === block.key ? (
                            <span className="text-xs text-green-600">Copied!</span>
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </CardTitle>
                      <CardDescription>{block.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {content}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}