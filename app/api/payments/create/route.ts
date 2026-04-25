import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAuth } from "@/lib/firebase/session";
import { createPaymentRequest } from "@/lib/instamojo/client";
import { FieldValue } from "firebase-admin/firestore";
import { getSite } from "@/lib/content";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { courseId, couponCode } = await request.json();

    if (!courseId) {
      return Response.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // Fetch course
    const courseDoc = await adminDb.collection("courses").doc(courseId).get();
    if (!courseDoc.exists) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }

    const course = courseDoc.data()!;

    // Check if already enrolled
    const existingEnrollment = await adminDb
      .collection("enrollments")
      .where("userId", "==", user.uid)
      .where("courseId", "==", courseId)
      .limit(1)
      .get();

    if (!existingEnrollment.empty) {
      return Response.json(
        { error: "You are already enrolled in this course" },
        { status: 400 }
      );
    }

    // Calculate price
    let amount = course.price;
    let couponUsed = "";

    if (couponCode) {
      const couponSnapshot = await adminDb
        .collection("coupons")
        .where("code", "==", couponCode)
        .limit(1)
        .get();

      if (!couponSnapshot.empty) {
        const coupon = couponSnapshot.docs[0].data();
        const now = new Date();
        const expiresAt = coupon.expiresAt?.toDate?.() || new Date(0);

        if (
          coupon.isActive &&
          expiresAt > now &&
          coupon.currentUses < coupon.maxUses &&
          (coupon.courseIds.length === 0 ||
            coupon.courseIds.includes(courseId))
        ) {
          if (coupon.discountAmount > 0) {
            amount = Math.max(0, amount - coupon.discountAmount);
          } else if (coupon.discountPercent > 0) {
            amount = Math.max(
              0,
              amount - (amount * coupon.discountPercent) / 100
            );
          }
          couponUsed = couponCode;
        }
      }
    }

    // Fetch user profile for details
    const userDoc = await adminDb.collection("users").doc(user.uid).get();
    const userProfile = userDoc.data();

    // Create payment doc in Firestore
    const paymentData = {
      userId: user.uid,
      courseId,
      courseTitle: course.title,
      courseCategory: course.category || "",
      amount,
      originalAmount: course.price,
      couponUsed,
      status: "PENDING" as const,
      instamojoPaymentId: "",
      instamojoPaymentRequestId: "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const paymentRef = await adminDb.collection("payments").add(paymentData);

    // Create Instamojo payment request
    const site = getSite();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || site.url;
    const paymentResponse = await createPaymentRequest({
      amount,
      purpose: `BA Courses - ${course.title}`,
      buyerName: userProfile?.name || user.email || "Student",
      email: user.email || "",
      phone: userProfile?.phone || "",
      redirectUrl: `${baseUrl}/payment/verify`,
      webhookUrl: `${baseUrl}/api/payments/webhook`,
    });

    // Update payment doc with Instamojo IDs
    await adminDb.collection("payments").doc(paymentRef.id).update({
      instamojoPaymentRequestId: paymentResponse.paymentRequestId,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({ paymentUrl: paymentResponse.longUrl });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating payment:", error);
    return Response.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
