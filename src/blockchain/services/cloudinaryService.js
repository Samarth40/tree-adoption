const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const API_BASE_URL = 'http://localhost:5000';

// Upload metadata to Cloudinary
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

        // Use our backend API endpoint with the correct base URL
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: cleanedMetadata,
                resource_type: 'raw',
                format: 'json'
            })
        });

        console.log('Upload response status:', response.status);

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            throw new Error(`Failed to parse server response: ${responseText}`);
        }

        if (!response.ok) {
            throw new Error(`Upload failed: ${result.error || 'Unknown error'}`);
        }

        if (!result || !result.url) {
            throw new Error('Upload failed: No URL returned');
        }

        console.log('Upload successful:', result);

        return {
            success: true,
            url: result.url,
            publicId: result.publicId
        };
    } catch (error) {
        console.error('Error uploading NFT metadata:', error);
        throw new Error(`Failed to upload NFT metadata: ${error.message}`);
    }
};

// Get metadata from Cloudinary
export const getNFTMetadata = async (url) => {
    try {
        console.log('Fetching metadata from URL:', url);
        
        if (!url) {
            console.error('Invalid metadata URL:', url);
            throw new Error('Invalid metadata URL');
        }

        const response = await fetch(url);
        const metadata = await response.json();
        
        if (!metadata) {
            console.error('No metadata received from URL:', url);
            throw new Error('No metadata received');
        }

        // Return a properly structured metadata object
        const structuredMetadata = {
            name: metadata.name || 'Unnamed NFT',
            description: metadata.description || 'No description available',
            image: metadata.image || '',
            attributes: Array.isArray(metadata.attributes) ? metadata.attributes : [],
            created_at: metadata.created_at || new Date().toISOString()
        };

        console.log('Returning structured metadata:', structuredMetadata);
        return structuredMetadata;
    } catch (error) {
        console.error('Error getting NFT metadata:', error);
        throw new Error(`Failed to get NFT metadata: ${error.message}`);
    }
};

// Upload NFT image to Cloudinary directly
export const uploadNFTImage = async (imageFile) => {
    try {
        // Convert image file to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
        reader.readAsDataURL(imageFile);
        const base64Data = await base64Promise;

        // Use our backend API endpoint with the correct base URL
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: base64Data,
                resource_type: 'image'
            })
        });

        console.log('Upload response status:', response.status);

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            throw new Error(`Failed to parse server response: ${responseText}`);
        }

        if (!response.ok) {
            throw new Error(`Upload failed: ${result.error || 'Unknown error'}`);
        }

        if (!result || !result.url) {
            throw new Error('Failed to upload image');
        }

        return {
            success: true,
            url: result.url,
            publicId: result.publicId
        };
    } catch (error) {
        console.error('Error uploading NFT image:', error);
        throw new Error(`Failed to upload NFT image: ${error.message}`);
    }
};

// For deletion, we'll use our backend API
export const deleteNFTAssets = async (metadata) => {
    try {
        if (!metadata) {
            throw new Error('Metadata is required for deletion');
        }

        console.log('Deleting NFT assets:', {
            metadata_uri: metadata.metadata_uri,
            image: metadata.image
        });

        // Use our backend API endpoint with the correct base URL
        const response = await fetch(`${API_BASE_URL}/api/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                public_id: metadata.metadata_uri,
                resource_type: 'raw'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Delete failed: ${errorData.error || 'Unknown error'}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error handling NFT assets deletion:', error);
        throw new Error(`Failed to handle NFT assets deletion: ${error.message}`);
    }
}; 