import { SubscriptionOption } from "@/hooks/use-create-subscription";
import { db } from "@/lib/prisma-client";
import { razorpay } from "@/lib/razorpay";


const createPlaneIfRequired = async (option: SubscriptionOption) => {
  const plans = await razorpay.plans.all();

  const existing_plan = plans.items.find(
    (plan) =>
      plan.period == option.period &&
      plan.item.name == option.name &&
      plan.item.amount == option.amount &&
      plan.item.currency == option.currency
  );

  if (existing_plan?.id) return existing_plan;
  const new_plan = await razorpay.plans.create({
    interval: 1,
    period: option.period,
    item: {
      amount: 23333,
      currency: "USD",
      name: option.name,
    },
  });

  return new_plan;
};

export const POST = async (req: Request) => {
  try {
    const option: SubscriptionOption = (await req.json()).option;
    
    const existingSubscription = await db.subscription.findFirst({
      where: { status: {in: ["active"]}, order: { userId: option.userId } },
      include: { order: true },
    });

    console.log({existingSubscription})

    if (existingSubscription) {
      console.log("Cancelling existing subscription");

      // const razorpay_new_subscriptions = await razorpay.subscriptions.fetch(existingSubscription.order.subscriptionId)

      // await razorpay.subscriptions.cancel(existingSubscription.order.subscriptionId, false);  Error: Subscription is not cancellable in completed status.

    }

    
    const plan = await createPlaneIfRequired(option);
    
    const razorpay_new_subscriptions = await razorpay.subscriptions.create({
      plan_id: plan.id,
      total_count: 1,
    });
    

    await db.order.create({
      data: {
        userId: option.userId,
        amount: option.amount,
        currency: option.currency,
        name: option.name,
        period: option.period,
        status: razorpay_new_subscriptions.status,
        subscriptionId: razorpay_new_subscriptions.id,
      },
    });

    // save in db with userId and subscriptionId

    return Response.json({ data: razorpay_new_subscriptions }, { status: 200 });
  } catch (error) {
    console.log({ error });
    return Response.json({ error: "error" }, { status: 500 });
  }
};
