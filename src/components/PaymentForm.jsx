import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true
};

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        console.log('Creating payment intent for amount:', amount);
        setError(null);
        
        const apiUrl = import.meta.env.PROD 
          ? '/api/create-payment-intent'  // In production, use relative path
          : 'http://localhost:5000/api/create-payment-intent'; // In development

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        console.log('Payment intent created successfully:', data.clientSecret);
        setClientSecret(data.clientSecret);
      } catch (err) {
        const errorMessage = err.message || 'Failed to initialize payment. Please try again.';
        console.error('Error creating payment intent:', err);
        setError(errorMessage);
        onError(err);
      }
    };

    if (amount) {
      createPaymentIntent();
    }
  }, [amount, onError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret || processing) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      console.log('Confirming card payment...');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Tree Adoption User',
          },
        }
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message);
        onError(stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        await onSuccess(paymentIntent);
        console.log('Success callback completed');
      } else {
        console.error('Payment failed:', paymentIntent);
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-forest-green border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading payment system...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Payment form">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
          Credit or debit card
        </label>
        <div 
          id="card-element" 
          role="group" 
          aria-label="Credit card input form"
          className={processing ? 'opacity-50 pointer-events-none' : ''}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg" role="alert">
          <p className="font-medium">Payment Error</p>
          <p>{error}</p>
        </div>
      )}

      <motion.button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className={`w-full bg-forest-green text-white py-4 rounded-xl text-lg font-medium 
          ${(!stripe || processing || !clientSecret) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-forest-green/90'} 
          transition-colors`}
        whileHover={{ scale: !processing && stripe ? 1.02 : 1 }}
        whileTap={{ scale: !processing && stripe ? 0.98 : 1 }}
        aria-label={processing ? 'Processing payment' : `Pay ₹${amount}`}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </div>
        ) : (
          `Pay ₹${amount}`
        )}
      </motion.button>

      {processing && (
        <p className="text-sm text-gray-500 text-center">
          Please don't close this window while we process your payment...
        </p>
      )}
    </form>
  );
};

export default PaymentForm; 