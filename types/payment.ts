export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  amount: number;
  originalAmount: number;
  couponUsed: string;
  status: PaymentStatus;
  instamojoPaymentId: string;
  instamojoPaymentRequestId: string;
  createdAt: Date;
  updatedAt: Date;
}
