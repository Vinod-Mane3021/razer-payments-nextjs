"use client"

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useCreateOrder } from "@/hooks/use-create-order";
import { Pricing } from "@/components/pricing";

export default function Home() {
  // const [amount, setAmount] = useState<number>(0);
  // const { createOrder, isLoading, error, data } = useCreateOrder();

  // US UK singapur Aust UAE
  // const handleOrder = async () => {
  //   if (amount <= 0) return alert("Please enter a valid amount");
  //   try {
  //     const orderData = await createOrder({
  //       option: {
  //         amount: amount * 100, // Convert to paise
  //         currency: "INR",
  //         receipt: `receipt_${Date.now()}`,
  //       },
  //     });
      
  //     console.log("Order created:", orderData);
  //   } catch (err) {
  //     console.error("Order creation failed:", err);
  //   }
  // };

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      {/* <h1>Razorpay Payments</h1> */}
{/* 
      <Input
        type="number"
        className="w-52 h-8 border-2 border-primary mt-10"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
      />

      <Button className="mt-10" onClick={handleOrder} disabled={isLoading}>
        {isLoading ? "Processing..." : "Buy"}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {data && <p className="text-green-500 mt-4">Order ID: {data.id}</p>} */}


      <Pricing/>
    </div>
  );
}