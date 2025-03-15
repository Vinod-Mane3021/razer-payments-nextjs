/* eslint-disable @typescript-eslint/no-explicit-any */

import { Subscriptions } from "razorpay/dist/types/subscriptions";
import { useState } from "react";

export type SubscriptionOption = {
  useId: string;
  period: "monthly" | "yearly"; // monthly or yearly
  name: "Starter" | "Pro" // Starter or Pro
  amount: number;
  currency: string;
}


interface SubscriptionDetails {
  option: SubscriptionOption
}

interface SubscriptionResponse {
  data: Subscriptions.RazorpaySubscription;
}

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const useCreateSubscription = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Subscriptions.RazorpaySubscription | null>(null);
  const user = {id: "1", name: "vinod", email: 'vinod@gmail.com'}

  const createSubscription = async (orderDetails: SubscriptionDetails): Promise<SubscriptionResponse> => {
    setIsLoading(true);
    setError(null);

    console.log({orderDetails})

    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        throw new Error("Razorpay SDK failed to load.");
      }

      const response = await fetch("/api/billing/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const result: SubscriptionResponse = await response.json();
      setData(result.data);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        subscription_id: result.data.id, // Use the actual subscription ID from API response
        name: user.name,
        description: "Monthly Test Plan",
        image: "https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/06/f8ad79e2-62c8-461b-9439-63f2c4976d96.jpeg?auto=format&q=60&fit=max&w=930",
        handler: function (response: any) {
          alert(`Payment ID: ${response.razorpay_payment_id}`);
          alert(`Subscription ID: ${response.razorpay_subscription_id}`);
          alert(`Signature: ${response.razorpay_signature}`);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: "+911125487569",
        },
        // notes: {
        //   note_key_1: "Tea. Earl Grey. Hot",
        //   note_key_2: "Make it so.",
        // },
        theme: { color: "#F37254" },
      };
      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
      return result;
    } catch (err) {
      console.log({razorpayInstance_error: err})
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSubscription, isLoading, error, data };
};


// import { Subscriptions } from "razorpay/dist/types/subscriptions";
// import { useState } from "react";
// import Razorpay from "razorpay";
// import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
// import { CurrencyCode } from "react-razorpay/dist/constants/currency";

// export type SubscriptionOption =
//   Subscriptions.RazorpaySubscriptionCreateRequestBody | 
//   Subscriptions.RazorpaySubscriptionLinkCreateRequestBody

// interface SubscriptionDetails {
//   option: SubscriptionOption;
// }

// interface SubscriptionResponse {
//   data: Subscriptions.RazorpaySubscription;
// }

// function loadScript(src: string) {
//   return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => {
//           resolve(true);
//       };
//       script.onerror = () => {
//           resolve(false);
//       };
//       document.body.appendChild(script);
//   });
// }

// export const useCreateSubscription = () => {
  
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<Subscriptions.RazorpaySubscription | null>(null);
//   const user = {id: "1", name: "vinod", email: 'vinod@gmail.com'}

//   const createOrder = async ( orderDetails: SubscriptionDetails ): Promise<SubscriptionResponse> => {

//     console.log({orderDetails})
//     setIsLoading(true);
//     setError(null);

//     try {

//       const res = await loadScript(
//           "https://checkout.razorpay.com/v1/checkout.js"
//       );

//       if (!res) {
//           alert("Razorpay SDK failed to load. Are you online?");
//           throw new Error("Razorpay SDK failed to load. Are you online?")
//     }

//       const response = await fetch("/api/billing/subscription/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderDetails),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create order");
//       }

//       const result: SubscriptionResponse = await response.json();

//       console.log({ result1212: result });

//       const options = { 
//         "key": "key_id",
//         "subscription_id": "sub_00000000000001", 
//         "name": "Acme Corp.", 
//         "description": "Monthly Test Plan", 
//         "image": "/your_logo.png", 
//         "handler": function(response) { 
//            alert(response.razorpay_payment_id)        
//            alert(response.razorpay_subscription_id)      
//            alert(response.razorpay_signature)
//         }, 
//         "prefill": { 
//            "name": "Gaurav Kumar", 
//            "email": "gaurav.kumar@example.com", 
//            "contact": "+919876543210" 
//         }, 
//         "notes": { 
//            "note_key_1": "Tea. Earl Grey. Hot", 
//            "note_key_2": "Make it so." 
//         }, 
//         "theme": { 
//         "color": "#F37254" 
//         } 
//      }; 

//       const razorpayInstance = new window.Razorpay(options);
//       razorpayInstance.open();

//       setData(result.data);

//       return result;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unknown error");
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     createOrder,
//     isLoading: isLoading || razorpay_loading,
//     error: error || razorpay_error,
//     data,
//   };
// };


