"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

export default function Test() {
  const [amount, setAmount] = useState<number>(0);
  const { error, isLoading, Razorpay } = useRazorpay();

  const handlePayment = () => {
    console.log({NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID})
    const options: RazorpayOrderOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: "order_Q3SgheWzNFhAwN", // Generate order_id on server
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };


  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col">
      <h1>Razorpay Payments</h1>

      <Input
        type="number"
        className="w-52 h-8 border-2 border-primary mt-10"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
      />

      <Button className="mt-10" onClick={handlePayment} disabled={isLoading}>
        {isLoading ? "Processing..." : "Buy Now"}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {/* {data && <p className="text-green-500 mt-4">Order ID: {data.id}</p>} */}
    </div>
  );
}