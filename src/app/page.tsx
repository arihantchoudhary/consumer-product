"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";

function HomeContent() {
  const router = useRouter();
  const user = useUser();

  const handleButtonClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div className="relative">
      {/* Framer page as background */}
      <iframe 
        src="/page.html" 
        className="w-full h-screen border-0"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}
      />
      
      {/* Sign In/Dashboard button overlay */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          onClick={handleButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          {user ? "Dashboard" : "Sign In"}
        </Button>
      </div>
    </div>
  );
}

export default function RootPage() {
  return (
    <Suspense fallback={
      <div className="relative">
        <iframe 
          src="/page.html" 
          className="w-full h-screen border-0"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}
        />
        <div className="absolute top-4 right-4 z-50">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            disabled
          >
            Loading...
          </Button>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
