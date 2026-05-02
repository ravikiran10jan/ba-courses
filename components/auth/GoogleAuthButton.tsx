"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase/auth";
import Button from "@/components/ui/Button";
import { getAuthForms } from "@/lib/content";

const af = getAuthForms();

export default function GoogleAuthButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Google sign-in error:", err);
      const code = (err as { code?: string })?.code;
      if (code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled. Please try again.");
      } else if (code === "auth/popup-blocked") {
        setError("Pop-up blocked by browser. Please allow pop-ups and try again.");
      } else if (code === "auth/unauthorized-domain") {
        setError("This domain is not authorized for Google sign-in. Please contact support.");
      } else {
        setError("Google sign-in failed. Please try again or use email sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <p className="text-red-500 text-sm text-center mb-2">{error}</p>
      )}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        loading={loading}
        onClick={handleGoogleSignIn}
        className="w-full rounded-lg gap-3"
      >
        {!loading && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.39l3.66-2.84v-.46z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      {af.google.button}
    </Button>
    </>
  );
}
