"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";

const SocialButtons = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocial = async (provider: string) => {
    setLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center gap-2"
        disabled={loading !== null}
        onClick={() => handleSocial("google")}
      >
        <SiGoogle className="h-4 w-4" aria-hidden="true" />
        {loading === "google" ? "Redirecting..." : "Continue with Google"}
      </Button>
    </div>
  );
};

export default SocialButtons;
