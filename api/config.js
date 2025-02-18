import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || ''
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || ''
    }
};

// Validate configuration in production
if (process.env.NODE_ENV === 'production') {
    const requiredVars = [
        ['STRIPE_SECRET_KEY', config.stripe.secretKey],
        ['CLOUDINARY_CLOUD_NAME', config.cloudinary.cloudName],
        ['CLOUDINARY_API_KEY', config.cloudinary.apiKey],
        ['CLOUDINARY_API_SECRET', config.cloudinary.apiSecret],
        ['CLOUDINARY_UPLOAD_PRESET', config.cloudinary.uploadPreset]
    ];

    const missing = requiredVars
        .filter(([name, value]) => !value)
        .map(([name]) => name);

    if (missing.length > 0) {
        console.warn('Missing environment variables:', missing);
    }
}

// Log configuration (excluding sensitive data)
console.log('Configuration loaded:', {
    port: config.port,
    nodeEnv: config.nodeEnv,
    stripe: {
        hasSecretKey: !!config.stripe.secretKey
    },
    cloudinary: {
        cloudName: config.cloudinary.cloudName,
        hasApiKey: !!config.cloudinary.apiKey,
        hasApiSecret: !!config.cloudinary.apiSecret,
        uploadPreset: config.cloudinary.uploadPreset
    }
});

export default config; 