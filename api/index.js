import Stripe from 'stripe';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

// Log initial configuration
console.log('Stripe key loaded:', process.env.VITE_STRIPE_SECRET_KEY ? 'Yes' : 'No');
console.log('Cloudinary config loaded:', {
    cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key: !!process.env.CLOUDINARY_API_KEY,
    api_secret: !!process.env.CLOUDINARY_API_SECRET,
    upload_preset: !!process.env.CLOUDINARY_UPLOAD_PRESET
});

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Route handling
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    // Payment Intent endpoint
    if (pathname === '/api/create-payment-intent' && req.method === 'POST') {
        try {
            const { amount } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ 
                    error: 'Invalid amount provided' 
                });
            }

            console.log('Creating payment intent for amount:', amount);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'inr',
                payment_method_types: ['card'],
                metadata: {
                    integration_check: 'accept_a_payment',
                },
            });

            console.log('Payment intent created successfully:', paymentIntent.id);

            return res.json({ 
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            });
        } catch (error) {
            console.error('Error creating payment intent:', error);
            return res.status(500).json({ 
                error: error.message || 'Failed to create payment intent',
                type: error.type,
                code: error.code 
            });
        }
    }

    // Upload endpoint
    if (pathname === '/api/upload' && req.method === 'POST') {
        try {
            const { data, resource_type = 'raw', upload_preset } = req.body;
            
            console.log('Received upload request with:', {
                resource_type,
                upload_preset,
                hasData: !!data
            });

            if (!data) {
                return res.status(400).json({ error: 'No data provided' });
            }

            // Log Cloudinary config
            console.log('Cloudinary Configuration:', {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                hasApiKey: !!process.env.CLOUDINARY_API_KEY,
                hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
            });

            let uploadData;
            let uploadOptions = {
                resource_type,
                upload_preset: upload_preset,
                folder: 'tree_nfts'
            };

            console.log('Upload options:', uploadOptions);

            if (resource_type === 'raw') {
                console.log('Processing JSON metadata');
                uploadData = Buffer.from(JSON.stringify(data)).toString('base64');
                uploadData = `data:application/json;base64,${uploadData}`;
            } else if (resource_type === 'image') {
                console.log('Processing image data');
                uploadData = data;
            }

            console.log('Attempting Cloudinary upload...');

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(uploadData, uploadOptions);
            console.log('Cloudinary upload successful:', {
                url: result.secure_url,
                public_id: result.public_id
            });

            return res.json({
                success: true,
                url: result.secure_url,
                publicId: result.public_id
            });
        } catch (error) {
            console.error('Detailed upload error:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                details: error.details || 'No additional details'
            });

            return res.status(500).json({
                error: 'Failed to upload to Cloudinary',
                details: error.message,
                errorType: error.name
            });
        }
    }

    // Delete endpoint
    if (pathname === '/api/delete' && req.method === 'POST') {
        try {
            const { public_id, resource_type = 'image' } = req.body;
            
            console.log('Received delete request for:', {
                public_id,
                resource_type
            });

            if (!public_id) {
                return res.status(400).json({ error: 'Public ID is required' });
            }

            // Delete from Cloudinary
            const result = await cloudinary.uploader.destroy(public_id, {
                resource_type: resource_type
            });

            console.log('Cloudinary delete result:', result);

            if (result.result !== 'ok') {
                throw new Error(`Failed to delete from Cloudinary: ${result.result}`);
            }

            return res.json({
                success: true,
                result: result
            });
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
            return res.status(500).json({
                error: 'Failed to delete from Cloudinary',
                details: error.message
            });
        }
    }

    // Health check endpoint
    if (pathname === '/api/health' && req.method === 'GET') {
        return res.json({ status: 'healthy' });
    }

    // If no route matches
    return res.status(404).json({ error: 'Not Found' });
} 