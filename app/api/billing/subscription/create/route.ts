import { SubscriptionOption } from "@/hooks/use-create-subscription";
import { db } from "@/lib/prisma-client";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

  // create new plan
//   const new_plan = await razorpay.plans.create({
//     interval: 1,
//     period: option.period,
//     item: {
//       amount: option.amount,
//       currency: option.currency,
//       name: option.name,
//     },
//   });

console.log("creating new plan")

    const new_plan = await razorpay.plans.create({
        interval: 1,
        period: option.period,
        item: {
        amount: 23333,
        currency: "USD",
        name: option.name,
        },
    });
    

    console.log({new_plan})

  return new_plan;
};

export const POST = async (req: Request) => {
  try {
    const option: SubscriptionOption = (await req.json()).option;
    console.log({option})
    const plan = await createPlaneIfRequired(option);
    const razorpay_subscriptions = await razorpay.subscriptions.create({
      plan_id: plan.id,
      total_count: 1,
    });
    console.log({ plan, razorpay_subscriptions });

     await db.subscription.create({
      data: {
        userId: option.useId,
        amount: option.amount,
        currency: option.currency,
        name: option.name,
        period: option.period,
        status: razorpay_subscriptions.status,
        subscriptionId: razorpay_subscriptions.id,
      }
    })

    // save in db with userId and subscriptionId

    return Response.json({ data: razorpay_subscriptions }, { status: 200 });
  } catch (error) {
    console.log({ error });
    return Response.json({ error: "error" }, { status: 500 });
  }
};



