import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: join(__dirname, '.env') });

// Debug: Log all environment variables
console.log('Environment Variables:', {
    NODE_ENV: process.env.NODE_ENV,
    STRIPE_KEY: process.env.STRIPE_SECRET_KEY?.substring(0, 10) + '...',
    CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_API_SECRET?.substring(0, 10) + '...',
    CLOUDINARY_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET
});

const app = express();

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' // specify the API version
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log configuration status
console.log('Environment:', process.env.NODE_ENV);
console.log('Stripe key loaded:', process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No');
console.log('Cloudinary config loaded:', {
    cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key: !!process.env.CLOUDINARY_API_KEY,
    api_secret: !!process.env.CLOUDINARY_API_SECRET,
    upload_preset: !!process.env.CLOUDINARY_UPLOAD_PRESET
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

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
            amount: Math.round(amount * 100),
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
        res.status(500).json({ 
            error: error.message || 'Failed to create payment intent',
            type: error.type,
            code: error.code 
        });
    }
});

// Cloudinary upload endpoint
app.post('/api/upload', async (req, res) => {
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

        let uploadData;
        let uploadOptions = {
            resource_type,
            upload_preset: upload_preset || process.env.CLOUDINARY_UPLOAD_PRESET,
            folder: 'tree_nfts'
        };

        if (resource_type === 'raw') {
            console.log('Processing JSON metadata');
            uploadData = Buffer.from(JSON.stringify(data)).toString('base64');
            uploadData = `data:application/json;base64,${uploadData}`;
        } else if (resource_type === 'image') {
            console.log('Processing image data');
            uploadData = data;
        }

        console.log('Attempting Cloudinary upload...');

        const result = await cloudinary.uploader.upload(uploadData, uploadOptions);
        console.log('Upload successful:', {
            url: result.secure_url,
            public_id: result.public_id
        });

        res.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Failed to upload to Cloudinary',
            details: error.message
        });
    }
});

// Cloudinary delete endpoint
app.post('/api/delete', async (req, res) => {
    try {
        const { public_id, resource_type = 'image' } = req.body;

        if (!public_id) {
            return res.status(400).json({ error: 'Public ID is required' });
        }

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: resource_type
        });

        if (result.result !== 'ok') {
            throw new Error(`Failed to delete from Cloudinary: ${result.result}`);
        }

        res.json({
            success: true,
            result: result
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            error: 'Failed to delete from Cloudinary',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app; 