import axios from 'axios';

const SERVER_URL = 'http://localhost:5000';  // Your server URL

// Upload metadata to Cloudinary through our server
export const uploadNFTMetadata = async (metadata) => {
    try {
        console.log('Preparing metadata for upload:', metadata);

        // Ensure metadata is properly structured and all fields are strings
        const cleanedMetadata = {
            name: String(metadata.name || ''),
            description: String(metadata.description || ''),
            image: String(metadata.image || ''),
            attributes: metadata.attributes.map(attr => ({
                trait_type: String(attr.trait_type || ''),
                value: String(attr.value || '')
            })),
            created_at: String(metadata.created_at || new Date().toISOString())
        };

        console.log('Cleaned metadata:', cleanedMetadata);

        // Use the correct upload preset name that matches Cloudinary
        const uploadPreset = 'tree_adoption_nft';

        console.log('Using upload preset:', uploadPreset);

        const response = await axios.post(`${SERVER_URL}/api/upload`, {
            data: cleanedMetadata,
            resource_type: 'raw',
            upload_preset: uploadPreset
        });

        if (!response.data || !response.data.success) {
            console.error('Upload failed:', response.data);
            throw new Error(response.data?.error || 'Upload failed');
        }

        console.log('Upload successful:', response.data);

        return {
            success: true,
            url: response.data.url,
            publicId: response.data.publicId
        };
    } catch (error) {
        console.error('Error uploading NFT metadata:', error);
        if (error.response) {
            console.error('Server response:', error.response.data);
        }
        throw new Error(`Failed to upload NFT metadata: ${error.message}`);
    }
};

// Get metadata from Cloudinary
export const getNFTMetadata = async (url) => {
    try {
        console.log('Fetching metadata from URL:', url);
        const response = await axios.get(url);
        console.log('Received metadata response:', response.data);

        // Ensure the metadata has the required structure
        const metadata = response.data;
        if (!metadata) {
            throw new Error('No metadata received');
        }

        // Return a properly structured metadata object
        return {
            name: metadata.name || 'Unnamed NFT',
            description: metadata.description || 'No description available',
            image: metadata.image || '',
            attributes: Array.isArray(metadata.attributes) ? metadata.attributes : [],
            created_at: metadata.created_at || new Date().toISOString()
        };
    } catch (error) {
        console.error('Error getting NFT metadata:', error);
        console.error('Failed URL:', url);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        throw new Error('Failed to get NFT metadata: ' + error.message);
    }
};

// Upload NFT image to Cloudinary through our server
export const uploadNFTImage = async (imageFile) => {
    try {
        // Use the correct upload preset name that matches Cloudinary
        const uploadPreset = 'tree_adoption_nft';

        // Convert image file to base64
        const reader = new FileReader();
        const imageBase64 = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });

        const response = await axios.post(`${SERVER_URL}/api/upload`, {
            data: imageBase64,
            resource_type: 'image',
            upload_preset: uploadPreset
        });

        if (!response.data || !response.data.success) {
            throw new Error('Failed to upload image');
        }

        return {
            success: true,
            url: response.data.url,
            publicId: response.data.publicId
        };
    } catch (error) {
        console.error('Error uploading NFT image:', error);
        throw new Error(`Failed to upload NFT image: ${error.message}`);
    }
}; 