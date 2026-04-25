"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getDashboardComponents } from "@/lib/content";

const rl = getDashboardComponents().referralLink;

interface ReferralLinkProps {
  referralCode: string;
}

export default function ReferralLink({ referralCode }: ReferralLinkProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const referralLink = `${siteUrl}/?ref=${referralCode}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Card className="mb-8">
      <h3 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">
        {rl.heading}
      </h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="flex-1 bg-input border border-input-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none cursor-default"
        />
        <Button
          variant={copied ? "secondary" : "primary"}
          size="md"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 shrink-0"
        >
          {copied ? (
            <>
              <Check size={16} />
              {rl.copied}
            </>
          ) : (
            <>
              <Copy size={16} />
              {rl.copyLink}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
