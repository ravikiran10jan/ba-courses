export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
}

export interface Coupon {
  code: string;
  discountAmount: number;
  discountPercent: number;
  courseIds: string[];
  maxUses: number;
  currentUses: number;
  expiresAt: Date;
  isActive: boolean;
}
