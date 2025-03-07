import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { Webhooks } from "razorpay/dist/types/webhooks";


type RazorpayWebhook = Webhooks.RazorpayWebhook
type RazorpayWebhookBaseRequestBody = Webhooks.RazorpayWebhookBaseRequestBody
type RazorpayWebhookCreateRequestBody = Webhooks.RazorpayWebhookCreateRequestBody
type RazorpayWebhookUpdateRequestBody = Webhooks.R

const samplePayloadEntityData = {
    id: 'pay_Q3VurzW5Fexlv1',
    entity: 'payment',
    amount: 11100,
    currency: 'INR',
    status: 'captured',
    order_id: 'order_Q3VuiH3AKIV5jU',
    invoice_id: null,
    international: false,
    method: 'card',
    amount_refunded: 0,
    refund_status: null,
    captured: true,
    description: 'Test Transaction',
    card_id: 'card_Q3Vus9EUchlrnL',
    card: {
    id: 'card_Q3Vus9EUchlrnL',
    entity: 'card',
    name: '',
    last4: '1111',
    network: 'Visa',
    type: 'prepaid',
    issuer: null,
    international: false,
    emi: false,
    sub_type: 'consumer',
    token_iin: null
    },
    bank: null,
    wallet: null,
    vpa: null,
    email: 'john.doe@example.com',
    contact: '+919999999999',
    notes: [],
    fee: 222,
    tax: 0,
    error_code: null,
    error_description: null,
    error_source: null,
    error_step: null,
    error_reason: null,
    acquirer_data: { auth_code: '946543' },
    emi_plan: null,
    created_at: 1741266071,
    reward: null,
    base_amount: 11100
}

const sampleWebhookData = {
    entity: 'event',
    account_id: 'acc_OxifJMH43DatW7',
    event: 'payment.captured',
    contains: [ 'payment' ],
    payload: { 
        payment: {
            entity: samplePayloadEntityData
        }  
    },
    created_at: 1741265725
}

type PayloadEntity = typeof samplePayloadEntityData
type Webhook = typeof sampleWebhookData

export async function POST(req: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
    const signature = req.headers.get("x-razorpay-signature") || "";
    
    const body = await req.text();

    console.log({body: req.body})
    console.log({text_body: body})

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid signature", { expectedSignature, receivedSignature: signature });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }


    /*
        {
        webhookData: {
            entity: 'event',
            account_id: 'acc_OxifJMH43DatW7',
            event: 'payment.captured',
            contains: [ 'payment' ],
            payload: { payment: [Object] },
            created_at: 1741265725
        }
        }



        payload: {
            id: 'pay_Q3VurzW5Fexlv1',
            entity: 'payment',
            amount: 11100,
            currency: 'INR',
            status: 'captured',
            order_id: 'order_Q3VuiH3AKIV5jU',
            invoice_id: null,
            international: false,
            method: 'card',
            amount_refunded: 0,
            refund_status: null,
            captured: true,
            description: 'Test Transaction',
            card_id: 'card_Q3Vus9EUchlrnL',
            card: {
            id: 'card_Q3Vus9EUchlrnL',
            entity: 'card',
            name: '',
            last4: '1111',
            network: 'Visa',
            type: 'prepaid',
            issuer: null,
            international: false,
            emi: false,
            sub_type: 'consumer',
            token_iin: null
            },
            bank: null,
            wallet: null,
            vpa: null,
            email: 'john.doe@example.com',
            contact: '+919999999999',
            notes: [],
            fee: 222,
            tax: 0,
            error_code: null,
            error_description: null,
            error_source: null,
            error_step: null,
            error_reason: null,
            acquirer_data: { auth_code: '946543' },
            emi_plan: null,
            created_at: 1741266071,
            reward: null,
            base_amount: 11100
        }
    */
    const webhookData: Webhook = JSON.parse(body)
    const event = webhookData.event
    const entity = webhookData.payload.payment.entity
    console.log({webhookData, event, entity})

    switch (event) {
      case "payment.authorized":
        // await handleAuthorizedLogic(payload);
        break;
      case "payment.captured":
        // await handleCapturedLogic(payload);
        break;
      case "payment.failed":
        // await handleFailedLogic(payload);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
        break;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export const POST = async (req: Request) => {
//     try {
//         const body = await req.text();
//         const signature = req.headers.get("x-razorpay-signature");
//         const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

//         console.log({
//             WEBHOOK_SECRET,
//             body,
//             signature
//         })

//         return Response.json({ data: "order" }, { status: 200 });
//     } catch (error) {
//         console.log({ error });
//         return Response.json({ error: "error" }, { status: 500 });
//     }
// };
