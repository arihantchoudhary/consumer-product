import { Loader2 } from "lucide-react";
import AnimatedBackground from "@/components/animated-background";

export default function Loading() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    </>
  );
}