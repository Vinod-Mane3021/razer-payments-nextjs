import { Orders } from "razorpay/dist/types/orders";
import { useState } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { CurrencyCode } from "react-razorpay/dist/constants/currency";

export type Option =
  | Orders.RazorpayOrderCreateRequestBody
  | Orders.RazorpayTransferCreateRequestBody
  | Orders.RazorpayAuthorizationCreateRequestBody;

interface OrderDetails {
  option: Option;
}

interface OrderResponse {
  data: Orders.RazorpayOrder;
}

export const useCreateOrder = () => {
  const {
    error: razorpay_error,
    isLoading: razorpay_loading,
    Razorpay,
  } = useRazorpay();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Orders.RazorpayOrder | null>(null);
  const user = {id: "1", name: "vinod", email: 'vinod@gmail.com'}

  const createOrder = async ( orderDetails: OrderDetails ): Promise<OrderResponse> => {

    console.log({orderDetails})
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result: OrderResponse = await response.json();

      console.log({ result1212: result });

      const options: RazorpayOrderOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Number(orderDetails.option.amount), // Amount in paise
        currency: orderDetails.option.currency as CurrencyCode,
        name: "Test Company Name",
        description: "Test Transaction Description",
        order_id: result.data.id,
        handler: (response) => {
          console.log(response);
          alert("Payment Successful!");
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();

      setData(result.data);

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    isLoading: isLoading || razorpay_loading,
    error: error || razorpay_error,
    data,
  };
};


