import { db } from "@/lib/prisma-client";
import { SubscriptionStatusType } from "@/types/subscription";
import crypto from "crypto";

const updateSubscription = async (
  subscriptionId: string,
  subscriptionPaymentMethod: string,
  status: SubscriptionStatusType
) => {

  // TODO: issue
  return await db.subscription.update({
    where: { subscriptionId,  },
    data: { status, paymentMethod: subscriptionPaymentMethod },
  });
};

export const POST = async (req: Request) => {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
    const signature = req.headers.get("x-razorpay-signature") || "";

    const body = await req.text();

    console.log({ body: req.body });
    console.log({ text_body: body });

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid signature", {
        expectedSignature,
        receivedSignature: signature,
      });
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const webhookData = JSON.parse(body);
    const event = webhookData.event;
    const subscriptionId = webhookData.payload.subscription.entity.id as string;
    const subscriptionPaymentMethod = webhookData.payload.subscription.entity.payment_method as string;

    switch (event) {
      case "subscription.activated":
        await updateSubscription(subscriptionId, subscriptionPaymentMethod, "active");
        break;
      case "subscription.pending":
        await updateSubscription(subscriptionId, subscriptionPaymentMethod, "pending");
        break;
      case "subscription.completed":
        await updateSubscription(subscriptionId, subscriptionPaymentMethod, "completed");
        break;
      default:
        console.log(`Unhandled event: ${event}`);
        break;
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
