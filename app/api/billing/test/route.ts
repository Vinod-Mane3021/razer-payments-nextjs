// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

export const GET = async (req: Request) => {
  console.log({req})
    // try {
        
    //     const subscription = await razorpay.subscriptions.fetch("sub_Q4HnB7o3xVlSs3")
    
    //     return Response.json({data: subscription}, {status: 200})
    // } catch (error) {
    //     return Response.json({error: error}, {status: 500})
    // }


    try {
    
            return Response.json({ data: "order" }, { status: 200 });
        } catch (error) {
            console.log({ error });
            return Response.json({ error: "error" }, { status: 500 });
        }

}