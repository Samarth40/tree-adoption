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
        
        if (!url) {
            console.error('Invalid metadata URL:', url);
            throw new Error('Invalid metadata URL');
        }

        const response = await axios.get(url);
        console.log('Raw metadata response:', response);
        console.log('Received metadata:', response.data);

        // Ensure the metadata has the required structure
        const metadata = response.data;
        if (!metadata) {
            console.error('No metadata received from URL:', url);
            throw new Error('No metadata received');
        }

        // Log the metadata structure
        console.log('Metadata structure:', {
            hasName: !!metadata.name,
            hasDescription: !!metadata.description,
            hasImage: !!metadata.image,
            hasAttributes: Array.isArray(metadata.attributes),
            hasCreatedAt: !!metadata.created_at
        });

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
        console.error('Failed URL:', url);
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        }
        if (error.request) {
            console.error('Error request:', error.request);
        }
        throw new Error(`Failed to get NFT metadata: ${error.message}`);
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

// Delete NFT metadata and image from Cloudinary
export const deleteNFTAssets = async (metadata) => {
    try {
        if (!metadata) {
            throw new Error('Metadata is required for deletion');
        }

        console.log('Deleting NFT assets from Cloudinary:', {
            metadata_uri: metadata.metadata_uri,
            image: metadata.image
        });

        // Extract public IDs from URLs
        const getPublicId = (url) => {
            try {
                const urlParts = url.split('/');
                const filename = urlParts[urlParts.length - 1];
                return filename.split('.')[0]; // Remove file extension
            } catch (error) {
                console.error('Error extracting public ID from URL:', error);
                return null;
            }
        };

        const deletePromises = [];

        // Delete metadata file
        if (metadata.metadata_uri) {
            const metadataPublicId = getPublicId(metadata.metadata_uri);
            if (metadataPublicId) {
                deletePromises.push(
                    axios.post(`${SERVER_URL}/api/delete`, {
                        public_id: metadataPublicId,
                        resource_type: 'raw'
                    })
                );
            }
        }

        // Delete image file
        if (metadata.image) {
            const imagePublicId = getPublicId(metadata.image);
            if (imagePublicId) {
                deletePromises.push(
                    axios.post(`${SERVER_URL}/api/delete`, {
                        public_id: imagePublicId,
                        resource_type: 'image'
                    })
                );
            }
        }

        if (deletePromises.length > 0) {
            const results = await Promise.all(deletePromises);
            console.log('Cloudinary deletion results:', results);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting NFT assets:', error);
        throw new Error(`Failed to delete NFT assets: ${error.message}`);
    }
}; 