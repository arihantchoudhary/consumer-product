"use client";

import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";

export function GreetingSection() {
  const user = useUser();
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Get full name directly from clientMetadata.name
  const fullName = user?.clientMetadata?.name?.trim() || user?.primaryEmail?.split("@")[0] || "there";

  return (
    <div className="w-full text-center py-8 px-4 rounded-xl bg-white/90 backdrop-blur-xl border border-gray-200 shadow-sm">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        {greeting}, {fullName}!
      </h1>
      <p className="text-gray-600 text-lg">
        What would you like to do today?
      </p>
    </div>
  );
}