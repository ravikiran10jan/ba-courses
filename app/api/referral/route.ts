import { type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAuth } from "@/lib/firebase/session";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const user = await requireAuth();

    // Get user's referral code
    const userDoc = await adminDb.collection("users").doc(user.uid).get();
    if (!userDoc.exists) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userProfile = userDoc.data()!;
    const referralCode = userProfile.referralCode || "";

    // Get all referrals made by this user
    const referralsSnapshot = await adminDb
      .collection("referrals")
      .where("referrerId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .get();

    const referrals = referralsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate summary
    const totalReferrals = referrals.length;
    const totalEarnings = referrals
      .filter((r) => (r as Record<string, unknown>).status === "PAID")
      .reduce((sum, r) => sum + ((r as Record<string, unknown>).amount as number || 0), 0);
    const pendingEarnings = referrals
      .filter((r) => (r as Record<string, unknown>).status === "PENDING")
      .reduce((sum, r) => sum + ((r as Record<string, unknown>).amount as number || 0), 0);

    return Response.json({
      referralCode,
      totalReferrals,
      totalEarnings,
      pendingEarnings,
      referrals,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching referral data:", error);
    return Response.json(
      { error: "Failed to fetch referral data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { referralCode, courseId } = await request.json();

    if (!referralCode || !courseId) {
      return Response.json(
        { error: "referralCode and courseId are required" },
        { status: 400 }
      );
    }

    // Find the referrer by referral code
    const referrerSnapshot = await adminDb
      .collection("users")
      .where("referralCode", "==", referralCode)
      .limit(1)
      .get();

    if (referrerSnapshot.empty) {
      return Response.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    const referrer = referrerSnapshot.docs[0];

    // Prevent self-referral
    if (referrer.id === user.uid) {
      return Response.json(
        { error: "Cannot use your own referral code" },
        { status: 400 }
      );
    }

    // Check for duplicate referral
    const existingReferral = await adminDb
      .collection("referrals")
      .where("referrerId", "==", referrer.id)
      .where("referredUserId", "==", user.uid)
      .where("courseId", "==", courseId)
      .limit(1)
      .get();

    if (!existingReferral.empty) {
      return Response.json(
        { error: "Referral already recorded" },
        { status: 400 }
      );
    }

    // Get course info
    const courseDoc = await adminDb.collection("courses").doc(courseId).get();
    const courseData = courseDoc.data();

    await adminDb.collection("referrals").add({
      referrerId: referrer.id,
      referredUserId: user.uid,
      courseId,
      courseTitle: courseData?.title || "",
      amount: 0, // Will be set by admin or calculated
      status: "PENDING",
      createdAt: FieldValue.serverTimestamp(),
    });

    return Response.json(
      { message: "Referral recorded successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error recording referral:", error);
    return Response.json(
      { error: "Failed to record referral" },
      { status: 500 }
    );
  }
}
