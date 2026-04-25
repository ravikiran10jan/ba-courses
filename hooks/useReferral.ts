"use client";

import { useEffect } from "react";

const REFERRAL_STORAGE_KEY = "ba_referral_code";

export function useReferralTracking(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");

    if (refCode) {
      localStorage.setItem(REFERRAL_STORAGE_KEY, refCode);
    }
  }, []);
}

export function getReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

export function clearReferralCode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}
