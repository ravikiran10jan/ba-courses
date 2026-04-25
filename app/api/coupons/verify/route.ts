import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const { code, courseId } = await request.json();

    if (!code) {
      return Response.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const couponSnapshot = await adminDb
      .collection("coupons")
      .where("code", "==", code)
      .limit(1)
      .get();

    if (couponSnapshot.empty) {
      return Response.json(
        { valid: false, error: "Invalid coupon code" },
        { status: 200 }
      );
    }

    const coupon = couponSnapshot.docs[0].data();
    const now = new Date();
    const expiresAt = coupon.expiresAt?.toDate?.() || new Date(0);

    // Check if coupon is active
    if (!coupon.isActive) {
      return Response.json(
        { valid: false, error: "This coupon is no longer active" },
        { status: 200 }
      );
    }

    // Check if coupon has expired
    if (expiresAt <= now) {
      return Response.json(
        { valid: false, error: "This coupon has expired" },
        { status: 200 }
      );
    }

    // Check if coupon has reached max uses
    if (coupon.currentUses >= coupon.maxUses) {
      return Response.json(
        { valid: false, error: "This coupon has reached its usage limit" },
        { status: 200 }
      );
    }

    // Check if coupon is applicable to this course
    if (
      courseId &&
      coupon.courseIds.length > 0 &&
      !coupon.courseIds.includes(courseId)
    ) {
      return Response.json(
        {
          valid: false,
          error: "This coupon is not valid for this course",
        },
        { status: 200 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountAmount > 0) {
      discountAmount = coupon.discountAmount;
    } else if (coupon.discountPercent > 0) {
      // For percentage discounts, we need the course price
      if (courseId) {
        const courseDoc = await adminDb
          .collection("courses")
          .doc(courseId)
          .get();
        if (courseDoc.exists) {
          const coursePrice = courseDoc.data()?.price || 0;
          discountAmount = Math.round(
            (coursePrice * coupon.discountPercent) / 100
          );
        }
      }
    }

    return Response.json({
      valid: true,
      discountAmount,
      discountPercent: coupon.discountPercent || 0,
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    return Response.json(
      { error: "Failed to verify coupon" },
      { status: 500 }
    );
  }
}
