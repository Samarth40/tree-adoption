const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Upload metadata to Cloudinary directly
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

        // Create a blob from the metadata
        const blob = new Blob([JSON.stringify(cleanedMetadata)], {
            type: 'application/json'
        });

        // Create form data
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'tree_nfts');

        // Upload directly to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        const result = await response.json();

        if (!result || !result.secure_url) {
            throw new Error('Upload failed: No URL returned');
        }

        console.log('Upload successful:', result);

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id
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
        // Create form data
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'tree_nfts');

        // Upload directly to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        const result = await response.json();

        if (!result || !result.secure_url) {
            throw new Error('Failed to upload image');
        }

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Error uploading NFT image:', error);
        throw new Error(`Failed to upload NFT image: ${error.message}`);
    }
};

// For deletion, we'll mark assets as inactive since we can't do direct deletion without API secret
export const deleteNFTAssets = async (metadata) => {
    try {
        if (!metadata) {
            throw new Error('Metadata is required for deletion');
        }

        console.log('Marking NFT assets as deleted:', {
            metadata_uri: metadata.metadata_uri,
            image: metadata.image
        });

        // Since we can't directly delete from Cloudinary without the API secret,
        // we'll just return success and let the blockchain handle the NFT state
        return { success: true };
    } catch (error) {
        console.error('Error handling NFT assets deletion:', error);
        throw new Error(`Failed to handle NFT assets deletion: ${error.message}`);
    }
}; 