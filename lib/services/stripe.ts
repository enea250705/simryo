import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function createStripePaymentIntent(amount: number, currency: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe requires the amount in cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return { success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
  } catch (error) {
    console.error('Error creating Stripe Payment Intent:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to create Payment Intent: ${errorMessage}` };
  }
}

export { stripe }; 
 
 
 
 
 
 
 
 
 
 
 