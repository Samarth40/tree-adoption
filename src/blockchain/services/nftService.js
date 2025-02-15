import { getWallet } from '../utils/walletUtils';
import { aptosClient, NFT_CONTRACT_ADDRESS } from '../config/aptosConfig';
import { uploadNFTMetadata, uploadNFTImage } from './cloudinaryService';
import { AptosClient } from 'aptos';

const client = new AptosClient(import.meta.env.VITE_APTOS_NODE_URL);
const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

// Create NFT metadata
const createNFTMetadata = (tree) => {
    return {
        name: `${tree.common_names.english || tree.scientific_name} NFT`,
        description: `Digital certificate of adoption for ${tree.scientific_name}`,
        image: tree.images.primary,
        attributes: [
            {
                trait_type: "Species",
                value: tree.scientific_name
            },
            {
                trait_type: "Location",
                value: tree.location?.address || "Community Garden, Delhi"
            },
            {
                trait_type: "Environmental Impact",
                value: `${tree.characteristics?.environmental_benefits?.co2_absorption_rate || 52}kg CO2 per year`
            }
        ]
    };
};

// Mint NFT
export const mintTreeNFT = async (treeData, imageFile, wallet) => {
    try {
        // 1. Upload the image to Cloudinary
        const imageUploadResult = await uploadNFTImage(imageFile);
        
        // 2. Prepare metadata
        const metadata = {
            name: treeData.name,
            description: treeData.description,
            image: imageUploadResult.url,
            attributes: [
                {
                    trait_type: "Species",
                    value: treeData.species
                },
                {
                    trait_type: "Location",
                    value: treeData.location
                },
                {
                    trait_type: "Age",
                    value: treeData.age
                },
                {
                    trait_type: "Health",
                    value: treeData.health
                }
            ]
        };

        // 3. Upload metadata to Cloudinary
        const metadataUploadResult = await uploadNFTMetadata(metadata);

        // 4. Prepare transaction payload for minting
        const payload = {
            type: "entry_function_payload",
            function: `${contractAddress}::tree_nft::mint_tree`,
            type_arguments: [],
            arguments: [
                metadataUploadResult.url,  // URI for the metadata
                treeData.name,             // Name of the tree
                treeData.description       // Description of the tree
            ]
        };

        // 5. Submit transaction to mint NFT
        const pendingTransaction = await wallet.signAndSubmitTransaction(payload);
        
        // 6. Wait for transaction
        const txResult = await client.waitForTransactionWithResult(pendingTransaction.hash);

        return {
            success: true,
            transactionHash: txResult.hash,
            metadata: metadata,
            metadataUrl: metadataUploadResult.url
        };

    } catch (error) {
        console.error('Error minting NFT:', error);
        throw new Error('Failed to mint NFT: ' + error.message);
    }
};

// Get NFT Collection
export const getNFTCollection = async (address) => {
    try {
        const resources = await aptosClient.getAccountResources(address);
        const nftResource = resources.find(r => 
            r.type === `${NFT_CONTRACT_ADDRESS}::tree_nft::TreeNFTCollection`
        );
        
        if (!nftResource) return [];
        
        return nftResource.data.tokens || [];
    } catch (error) {
        console.error('Error getting NFT collection:', error);
        throw error;
    }
};

// Get NFT Details
export const getNFTDetails = async (tokenId) => {
    try {
        const resource = await aptosClient.getAccountResource(
            NFT_CONTRACT_ADDRESS,
            `${NFT_CONTRACT_ADDRESS}::tree_nft::TreeNFT`
        );
        
        const token = resource.data.tokens.find(t => t.id === tokenId);
        return token || null;
    } catch (error) {
        console.error('Error getting NFT details:', error);
        throw error;
    }
}; 