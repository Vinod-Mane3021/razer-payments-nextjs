import { Option } from "@/hooks/use-create-order";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const POST = async (req: Request) => {
    try {
        const option: Option = (await req.json()).option
        // option.amount = Math.round(Number(option.amount));
        console.log({option})
        const order = await razorpay.orders.create(option);
        // await razorpay.subscriptions.create({
        //     plan_id: "",


        // })
        return Response.json({ data: order }, { status: 200 });
    } catch (error) {
        console.log({ error });
        return Response.json({ error: "error" }, { status: 500 });
    }
};



