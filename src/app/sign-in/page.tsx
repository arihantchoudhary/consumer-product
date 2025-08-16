"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { SignIn } from "@stackframe/stack";
import AnimatedBackground from "@/components/animated-background";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  const user = useUser();
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push("/choose");
    }
  }, [user, router]);

  return (
    <>
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white shadow-2xl border border-gray-200">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
              Voice Assistant
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              AI-powered voice assistance platform
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <SignIn 
              fullPage={false}
              automaticRedirect={false}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
