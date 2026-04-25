"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { ReferralSummary } from "@/types";
import { formatCurrency } from "@/lib/utils/format";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import ReferralLink from "@/components/dashboard/ReferralLink";
import { getReferral } from "@/lib/content";

const ref = getReferral();

const ITEMS_PER_PAGE = 6;

export default function ReferralPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [referrals, setReferrals] = useState<ReferralSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    async function fetchReferrals() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/referral");
        if (!res.ok) throw new Error("Failed to fetch referrals");
        const data = await res.json();
        setReferrals(data.referrals ?? data ?? []);
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchReferrals();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // Summary totals
  const totalEarned = referrals.reduce((sum, r) => sum + r.total, 0);
  const totalClaimed = referrals.reduce((sum, r) => sum + r.claimed, 0);
  const totalClaimable = referrals.reduce((sum, r) => sum + r.claimable, 0);

  const visibleReferrals = referrals.slice(0, visibleCount);
  const hasMore = visibleCount < referrals.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black">{ref.heading}</h1>
      </div>

      {/* Referral link */}
      {profile?.referralCode && (
        <ReferralLink referralCode={profile.referralCode} />
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-sm text-muted mb-1">{ref.totalEarned}</p>
          <p className="text-2xl font-black">{formatCurrency(totalEarned)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-1">{ref.totalClaimed}</p>
          <p className="text-2xl font-black">{formatCurrency(totalClaimed)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-1">{ref.totalClaimable}</p>
          <p className="text-2xl font-black text-success">
            {formatCurrency(totalClaimable)}
          </p>
        </Card>
      </div>

      {/* Referral cards */}
      {referrals.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-lg">{ref.emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleReferrals.map((referral) => (
              <Card key={referral.courseId} hover>
                <h3 className="font-bold text-base mb-2 line-clamp-2">
                  {referral.courseTitle}
                </h3>

                <Badge variant="category">{referral.courseTitle}</Badge>

                <div className="space-y-2 mt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">{ref.total}</span>
                    <span className="font-semibold">
                      {formatCurrency(referral.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">{ref.claimed}</span>
                    <span className="font-semibold">
                      {formatCurrency(referral.claimed)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">{ref.claimable}</span>
                    <span className="font-semibold text-success">
                      {formatCurrency(referral.claimable)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-card-border">
                  <Badge
                    variant="status"
                    color={
                      referral.status === "PAID"
                        ? "success"
                        : referral.status === "CLAIMED"
                          ? "warning"
                          : "default"
                    }
                  >
                    {referral.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="secondary"
                size="md"
                onClick={() =>
                  setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                }
              >
                {ref.viewMore}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
