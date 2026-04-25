import { adminDb } from "@/lib/firebase/admin";
import { verifyWebhookSignature } from "@/lib/instamojo/webhook";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      if (key !== "mac") {
        data[key] = value.toString();
      }
    });

    const mac = formData.get("mac")?.toString() || "";

    // Verify webhook signature
    if (!verifyWebhookSignature(data, mac)) {
      console.error("Invalid webhook signature");
      return Response.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const paymentRequestId = data.payment_request_id;
    const paymentId = data.payment_id;
    const status = data.status;

    if (!paymentRequestId) {
      return Response.json(
        { error: "Missing payment_request_id" },
        { status: 400 }
      );
    }

    // Find the payment by paymentRequestId
    const paymentSnapshot = await adminDb
      .collection("payments")
      .where("instamojoPaymentRequestId", "==", paymentRequestId)
      .limit(1)
      .get();

    if (paymentSnapshot.empty) {
      console.error(
        "Payment not found for request ID:",
        paymentRequestId
      );
      return Response.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    const paymentDoc = paymentSnapshot.docs[0];
    const payment = paymentDoc.data();

    if (status === "Credit") {
      // Payment successful
      const batch = adminDb.batch();

      // Update payment status
      batch.update(paymentDoc.ref, {
        status: "COMPLETED",
        instamojoPaymentId: paymentId || "",
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Create enrollment
      const courseDoc = await adminDb
        .collection("courses")
        .doc(payment.courseId)
        .get();
      const courseData = courseDoc.data();

      // Count total lessons for this course
      const lessonsSnapshot = await adminDb
        .collection("lessons")
        .where("courseId", "==", payment.courseId)
        .get();

      const enrollmentRef = adminDb.collection("enrollments").doc();
      batch.set(enrollmentRef, {
        userId: payment.userId,
        courseId: payment.courseId,
        courseTitle: courseData?.title || payment.courseTitle,
        courseThumbnail: courseData?.thumbnailUrl || "",
        courseSlug: courseData?.slug || "",
        completedLessons: [],
        totalLessons: lessonsSnapshot.size,
        progressPercent: 0,
        isCompleted: false,
        completedAt: null,
        enrolledAt: FieldValue.serverTimestamp(),
      });

      // Increment course enrolled count
      batch.update(adminDb.collection("courses").doc(payment.courseId), {
        enrolledCount: FieldValue.increment(1),
      });

      // Increment coupon usage if coupon was used
      if (payment.couponUsed) {
        const couponSnapshot = await adminDb
          .collection("coupons")
          .where("code", "==", payment.couponUsed)
          .limit(1)
          .get();

        if (!couponSnapshot.empty) {
          batch.update(couponSnapshot.docs[0].ref, {
            currentUses: FieldValue.increment(1),
          });
        }
      }

      await batch.commit();
    } else {
      // Payment failed
      await paymentDoc.ref.update({
        status: "FAILED",
        instamojoPaymentId: paymentId || "",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
