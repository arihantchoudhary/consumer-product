"use client";

import { TranscriptAnalyzer } from "@/components/transcript-analyzer";
import AccessGuard from "@/components/access-guard";
import { useRouter } from "next/navigation";

export default function TranscriptAnalyzerPage() {
  const router = useRouter();

  return (
    <AccessGuard requiredPage="transcript-analyzer">
      <TranscriptAnalyzer onBack={() => router.push("/choose")} />
    </AccessGuard>
  );
}