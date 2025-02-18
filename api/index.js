import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://tree-adoption.vercel.app',
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Initialize Express app
const app = express();
const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2023-10-16'
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
});

// Verify Cloudinary configuration
console.log('Cloudinary Configuration:', {
    cloud_name: config.cloudinary.cloudName,
    hasApiKey: !!config.cloudinary.apiKey,
    hasApiSecret: !!config.cloudinary.apiSecret,
    uploadPreset: config.cloudinary.uploadPreset
});

// Log configuration status
console.log('Environment:', config.nodeEnv);
console.log('Stripe Key:', config.stripe.secretKey.substring(0, 10) + '...');
console.log('Cloudinary Name:', config.cloudinary.cloudName);
console.log('Cloudinary config loaded:', {
    cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key: !!process.env.CLOUDINARY_API_KEY,
    api_secret: !!process.env.CLOUDINARY_API_SECRET,
    upload_preset: !!process.env.CLOUDINARY_UPLOAD_PRESET
});

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
    res.status(200).json({
        status: 'API is running',
        environment: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL,
        timestamp: new Date().toISOString(),
        cors: {
            origins: corsOptions.origin,
            methods: corsOptions.methods
        },
        config: {
            hasStripeKey: !!config.stripe.secretKey,
            cloudinary: {
                hasCloudName: !!config.cloudinary.cloudName,
                hasApiKey: !!config.cloudinary.apiKey,
                hasApiSecret: !!config.cloudinary.apiSecret,
                hasUploadPreset: !!config.cloudinary.uploadPreset
            }
        }
    });
});

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Tree Adoption API',
        status: 'running',
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
        
        console.log('Received upload request:', {
            resource_type,
            upload_preset: upload_preset || config.cloudinary.uploadPreset,
            hasData: !!data,
            dataType: typeof data
        });

        if (!data) {
            return res.status(400).json({ error: 'No data provided' });
        }

        // Verify Cloudinary configuration is loaded
        if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
            console.error('Missing Cloudinary configuration:', {
                hasCloudName: !!config.cloudinary.cloudName,
                hasApiKey: !!config.cloudinary.apiKey,
                hasApiSecret: !!config.cloudinary.apiSecret
            });
            return res.status(500).json({ error: 'Cloudinary configuration is incomplete' });
        }

        let uploadData;
        let uploadOptions = {
            folder: 'tree_nfts',
            api_key: config.cloudinary.apiKey,
            timestamp: Math.round(new Date().getTime() / 1000),
            overwrite: true
        };

        console.log('Processing upload with options:', uploadOptions);

        try {
            if (resource_type === 'raw') {
                console.log('Processing JSON metadata');
                // Create a temporary file with the JSON data
                const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
                uploadData = `data:application/json;base64,${Buffer.from(jsonString).toString('base64')}`;
                
                // Add specific options for JSON upload
                uploadOptions = {
                    ...uploadOptions,
                    resource_type: 'raw',
                    format: 'json'
                };
                
                console.log('Prepared JSON data for upload');
            } else if (resource_type === 'image') {
                console.log('Processing image data');
                uploadData = data;
                
                // Add specific options for image upload
                uploadOptions = {
                    ...uploadOptions,
                    resource_type: 'image'
                };
            }

            console.log('Initiating Cloudinary upload with options:', {
                ...uploadOptions,
                hasData: !!uploadData
            });

            const result = await cloudinary.uploader.upload(uploadData, uploadOptions);
            
            console.log('Upload successful:', {
                url: result.secure_url,
                public_id: result.public_id,
                resource_type: result.resource_type,
                format: result.format
            });

            return res.json({
                success: true,
                url: result.secure_url,
                publicId: result.public_id
            });
        } catch (uploadError) {
            console.error('Cloudinary upload error details:', {
                message: uploadError.message,
                name: uploadError.name,
                details: uploadError.error || uploadError.details || 'No additional details'
            });
            throw uploadError;
        }
    } catch (error) {
        console.error('Error handling upload:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            details: error.details || 'No additional details'
        });

        return res.status(500).json({
            error: 'Failed to upload to Cloudinary',
            details: error.message,
            type: error.name,
            cloudinaryError: error.error || 'Unknown Cloudinary error'
        });
    }
});

// Cloudinary delete endpoint
app.post('/api/delete', async (req, res) => {
    try {
        const { public_id, resource_type = 'image' } = req.body;
        
        console.log('Received delete request for:', {
            public_id,
            resource_type
        });

        if (!public_id) {
            return res.status(400).json({ error: 'Public ID is required' });
        }

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: resource_type
        });

        console.log('Cloudinary delete result:', result);

        if (result.result !== 'ok') {
            throw new Error(`Failed to delete from Cloudinary: ${result.result}`);
        }

        res.json({
            success: true,
            result: result
        });
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        res.status(500).json({
            error: 'Failed to delete from Cloudinary',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Handle both serverless and traditional server environments
if (process.env.NODE_ENV !== 'production') {
    const port = config.port || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log('Stripe key loaded:', process.env.VITE_STRIPE_SECRET_KEY ? 'Yes' : 'No');
        console.log('Cloudinary config loaded:', {
            cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
            api_key: !!process.env.CLOUDINARY_API_KEY,
            api_secret: !!process.env.CLOUDINARY_API_SECRET,
            upload_preset: !!process.env.CLOUDINARY_UPLOAD_PRESET
        });
    });
}

export default app; 