export type ReferralStatus = "PENDING" | "CLAIMED" | "PAID";

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  status: ReferralStatus;
  createdAt: Date;
}

export interface ReferralSummary {
  courseId: string;
  courseTitle: string;
  total: number;
  claimed: number;
  claimable: number;
  status: string;
}
