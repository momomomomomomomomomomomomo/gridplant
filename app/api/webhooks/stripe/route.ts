import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

// Define the POST handler function for the Stripe webhook
export async function POST(req: NextRequest) {
  // Initialize Stripe with the secret API key from environment variables
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  
  // Construct the event using the raw request body, the Stripe signature header, and the webhook secret.
  // This ensures that the request is indeed from Stripe and has not been tampered with.
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
  // payment_intent.succeeded indicates a successful payment
  if (event.type === 'payment_intent.succeeded') {
    // Retrieve the order ID from the payment metadata
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // Update the order status to paid
    await updateOrderToPaid({
      orderId: paymentIntent.metadata.orderId,
      paymentResult: {
        id: paymentIntent.id,
        status: 'COMPLETED',
        email_address: paymentIntent.receipt_email || '',
        pricePaid: (paymentIntent.amount / 100).toFixed(2),
      },
    });

    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    });
  }
  return NextResponse.json({
    message: 'event is not payment_intent.succeeded',
  });
}
