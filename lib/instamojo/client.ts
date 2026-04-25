const BASE_URL =
  process.env.INSTAMOJO_BASE_URL || "https://test.instamojo.com/v2";
const API_KEY = process.env.INSTAMOJO_API_KEY || "";
const AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN || "";

interface PaymentRequestParams {
  amount: number;
  purpose: string;
  buyerName: string;
  email: string;
  phone: string;
  redirectUrl: string;
  webhookUrl: string;
}

interface PaymentRequestResponse {
  paymentRequestId: string;
  longUrl: string;
}

export async function createPaymentRequest(
  params: PaymentRequestParams
): Promise<PaymentRequestResponse> {
  const response = await fetch(`${BASE_URL}/payment-requests/`, {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY,
      "X-Auth-Token": AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      purpose: params.purpose,
      buyer_name: params.buyerName,
      email: params.email,
      phone: params.phone,
      redirect_url: params.redirectUrl,
      webhook: params.webhookUrl,
      send_email: false,
      allow_repeated_payments: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Instamojo payment request failed: ${response.status} ${
        errorData ? JSON.stringify(errorData) : response.statusText
      }`
    );
  }

  const data = await response.json();
  return {
    paymentRequestId: data.id,
    longUrl: data.longurl,
  };
}

export async function getPaymentStatus(paymentRequestId: string) {
  const response = await fetch(
    `${BASE_URL}/payment-requests/${paymentRequestId}/`,
    {
      headers: {
        "X-Api-Key": API_KEY,
        "X-Auth-Token": AUTH_TOKEN,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Instamojo status check failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
