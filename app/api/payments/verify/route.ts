import { type NextRequest } from "next/server";
import { getPaymentStatus } from "@/lib/instamojo/client";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    const paymentRequestId = request.nextUrl.searchParams.get(
      "payment_request_id"
    );

    if (!paymentRequestId) {
      return Response.json(
        { error: "payment_request_id is required" },
        { status: 400 }
      );
    }

    // Get status from Instamojo
    const instamojoData = await getPaymentStatus(paymentRequestId);

    // Also get our internal payment status
    const paymentSnapshot = await adminDb
      .collection("payments")
      .where("instamojoPaymentRequestId", "==", paymentRequestId)
      .limit(1)
      .get();

    const internalStatus = paymentSnapshot.empty
      ? null
      : paymentSnapshot.docs[0].data().status;

    return Response.json({
      instamojoStatus: instamojoData.status,
      internalStatus,
      paymentId: paymentSnapshot.empty
        ? null
        : paymentSnapshot.docs[0].id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return Response.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
