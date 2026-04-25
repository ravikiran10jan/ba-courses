"use client";

import { useState, useEffect } from "react";
import { Trophy, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Achievement } from "@/types";
import { formatDate } from "@/lib/utils/format";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import CertificateModal from "@/components/dashboard/CertificateModal";
import { getAchievement } from "@/lib/content";

const ach = getAchievement();

export default function AchievementPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "achievements"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as unknown as Achievement
        );
        setAchievements(data);
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchAchievements();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">{ach.heading}</h1>

      {achievements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-6" role="img" aria-label="Trophy">
            <Trophy size={64} className="text-muted" />
          </span>
          <h2 className="text-xl font-bold mb-3">{ach.emptyTitle}</h2>
          <p className="text-muted max-w-md">
            {ach.emptyMessage}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const earnedDate =
              achievement.earnedAt instanceof Date
                ? achievement.earnedAt
                : typeof achievement.earnedAt === "object" &&
                    achievement.earnedAt !== null &&
                    "toDate" in achievement.earnedAt
                  ? (
                      achievement.earnedAt as unknown as { toDate: () => Date }
                    ).toDate()
                  : new Date(achievement.earnedAt as unknown as string);

            return (
              <Card key={achievement.id} hover>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award size={24} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base mb-1 line-clamp-2">
                      {achievement.courseTitle}
                    </h3>
                    <Badge variant="status" color="success">
                      {ach.courseCompletion}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between">
                  <span className="text-sm text-muted">
                    {formatDate(earnedDate)}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedAchievement(achievement)}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Award size={14} />
                    {ach.viewCertificate}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedAchievement && (
        <CertificateModal
          isOpen={!!selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          studentName={profile?.name || user?.displayName || "Student"}
          courseName={selectedAchievement.courseTitle}
          completionDate={formatDate(
            selectedAchievement.earnedAt instanceof Date
              ? selectedAchievement.earnedAt
              : typeof selectedAchievement.earnedAt === "object" &&
                  selectedAchievement.earnedAt !== null &&
                  "toDate" in selectedAchievement.earnedAt
                ? (
                    selectedAchievement.earnedAt as unknown as {
                      toDate: () => Date;
                    }
                  ).toDate()
                : new Date(
                    selectedAchievement.earnedAt as unknown as string
                  )
          )}
          certificateId={selectedAchievement.id}
        />
      )}
    </div>
  );
}
