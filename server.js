import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create Payment Intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount provided' 
      });
    }

    console.log('Creating payment intent for amount:', amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
      currency: 'inr',
      payment_method_types: ['card'],
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    console.log('Payment intent created successfully:', paymentIntent.id);

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Send appropriate error response
    res.status(500).json({ 
      error: error.message || 'Failed to create payment intent',
      type: error.type,
      code: error.code 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Stripe key loaded:', process.env.VITE_STRIPE_SECRET_KEY ? 'Yes' : 'No');
}); 