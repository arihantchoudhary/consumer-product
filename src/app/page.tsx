"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RootPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <div className="relative">
      {/* Framer page as background */}
      <iframe 
        src="/page.html" 
        className="w-full h-screen border-0"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}
      />
      
      {/* Sign In button overlay */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          onClick={handleSignIn}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
