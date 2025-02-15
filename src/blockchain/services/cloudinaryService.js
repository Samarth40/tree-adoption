import axios from 'axios';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Upload metadata to Cloudinary
export const uploadNFTMetadata = async (metadata) => {
    try {
        // Convert metadata to JSON string
        const metadataBlob = new Blob([JSON.stringify(metadata)], {
            type: 'application/json'
        });

        // Create form data
        const formData = new FormData();
        formData.append('file', metadataBlob, 'metadata.json');
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('resource_type', 'raw');

        // Upload to Cloudinary
        const response = await axios.post(
            `${CLOUDINARY_URL}/raw/upload`,
            formData
        );

        return {
            success: true,
            url: response.data.secure_url,
            publicId: response.data.public_id
        };
    } catch (error) {
        console.error('Error uploading NFT metadata:', error);
        throw new Error('Failed to upload NFT metadata');
    }
};

// Get metadata from Cloudinary
export const getNFTMetadata = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error getting NFT metadata:', error);
        throw new Error('Failed to get NFT metadata');
    }
};

// Upload NFT image to Cloudinary
export const uploadNFTImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await axios.post(
            `${CLOUDINARY_URL}/image/upload`,
            formData
        );

        return {
            success: true,
            url: response.data.secure_url,
            publicId: response.data.public_id
        };
    } catch (error) {
        console.error('Error uploading NFT image:', error);
        throw new Error('Failed to upload NFT image');
    }
}; 