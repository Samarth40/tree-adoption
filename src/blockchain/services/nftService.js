import { getWallet } from '../utils/walletUtils';
import { aptos, NFT_CONTRACT_ADDRESS } from '../config/aptosConfig';
import { uploadNFTMetadata } from './cloudinaryService';

const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

// Create NFT metadata
const createNFTMetadata = (tree) => {
    if (!tree) {
        throw new Error('Tree data is required');
    }

    // Ensure required fields exist
    const name = tree.common_names?.english || tree.scientific_name || 'Tree NFT';
    const description = tree.scientific_name ? 
        `Digital certificate of adoption for ${tree.scientific_name}` : 
        'Digital certificate of tree adoption';
    const image = tree.images?.primary || tree.image || null;

    if (!image) {
        throw new Error('Tree image is required');
    }

    return {
        name: `${name} NFT`,
        description,
        image,
        attributes: [
            {
                trait_type: "Species",
                value: tree.scientific_name || 'Unknown Species'
            },
            {
                trait_type: "Location",
                value: tree.location?.address || "Community Garden, Delhi"
            },
            {
                trait_type: "Environmental Impact",
                value: `${tree.characteristics?.environmental_benefits?.co2_absorption_rate || 52}kg CO2 per year`
            }
        ],
        created_at: new Date().toISOString()
    };
};

// Mint NFT
export const mintTreeNFT = async (treeData, wallet) => {
    try {
        if (!wallet) {
            throw new Error('Wallet is required');
        }

        if (!treeData) {
            throw new Error('Tree data is required');
        }

        // 1. Prepare metadata using existing image URL
        const metadata = createNFTMetadata(treeData);
        console.log('Prepared metadata:', metadata);

        // 2. Upload metadata to Cloudinary
        console.log('Uploading metadata to Cloudinary...');
        const metadataUploadResult = await uploadNFTMetadata(metadata);
        
        if (!metadataUploadResult || !metadataUploadResult.url) {
            throw new Error('Failed to get metadata URL from upload');
        }
        
        console.log('Metadata upload result:', metadataUploadResult);

        // Convert tree name to a valid string identifier with timestamp for uniqueness
        const timestamp = Date.now();
        const treeId = `${metadata.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${timestamp}`;
        console.log('Generated tree ID:', treeId);

        try {
            console.log('Starting NFT minting process...');
            console.log('Contract address:', contractAddress);
            
            // Get the wallet account
            const account = await wallet.account();
            if (!account) {
                throw new Error('No account found in wallet');
            }
            console.log('Sender address:', account.address);

            // 3. Create the transaction payload
            const payload = {
                function: `${contractAddress}::tree_nft::mint_tree_nft`,
                type_arguments: [],
                arguments: [treeId, metadataUploadResult.url, "52"]
            };

            console.log('Transaction payload:', payload);

            // 4. Generate, sign, and submit transaction using Petra wallet
            try {
                const pendingTxn = await wallet.signAndSubmitTransaction({
                    payload: payload
                });
                console.log('Transaction submitted:', pendingTxn);

                if (!pendingTxn?.hash) {
                    throw new Error('Transaction hash is missing from wallet response');
                }

                // Wait for transaction with proper hash parameter
                console.log('Waiting for transaction confirmation with hash:', pendingTxn.hash);
                try {
                    const txResult = await aptos.waitForTransaction({
                        transactionHash: pendingTxn.hash
                    });
                    console.log('Transaction confirmed:', txResult);

                    return {
                        success: true,
                        transactionHash: pendingTxn.hash,
                        metadata: metadata,
                        metadataUrl: metadataUploadResult.url
                    };
                } catch (waitError) {
                    console.error('Error waiting for transaction:', waitError);
                    throw new Error(`Transaction confirmation failed: ${waitError.message}`);
                }
            } catch (txError) {
                console.error('Transaction error:', txError);
                throw new Error(`Transaction failed: ${txError.message}`);
            }
        } catch (txError) {
            console.error('Transaction error:', txError);
            if (txError.message?.includes('AptosApiError')) {
                throw new Error(`Aptos API Error: ${txError.data?.message || txError.message}`);
            }
            throw new Error(`Transaction failed: ${txError.message}`);
        }
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw new Error('Failed to mint NFT: ' + error.message);
    }
};

// Get NFT Collection
export const getNFTCollection = async (address) => {
    try {
        if (!address) {
            throw new Error('Wallet address is required');
        }

        // Ensure address is a string
        const addressStr = address.toString();
        console.log('Getting NFTs for address:', addressStr);
        console.log('Using NFT contract address:', NFT_CONTRACT_ADDRESS);

        // Get all resources for the account
        const resources = await aptos.getAccountResources({
            accountAddress: addressStr
        });
        console.log('Found account resources:', resources.length);
        
        // Log all resource types for debugging
        console.log('Available resource types:', resources.map(r => r.type));

        // Find the NFT collection resource
        const expectedType = `${NFT_CONTRACT_ADDRESS}::tree_nft::TreeNFTCollection`;
        console.log('Looking for resource type:', expectedType);
        
        const nftResource = resources.find(r => r.type === expectedType);
        
        if (!nftResource) {
            console.log('No NFT collection found for address:', addressStr);
            console.log('Expected resource type not found:', expectedType);
            return [];
        }
        
        console.log('Found NFT resource:', nftResource);
        console.log('NFT data:', nftResource.data);
        
        // Use minted_trees array instead of tokens
        const mintedTrees = nftResource.data.minted_trees || [];
        console.log('Found minted trees:', mintedTrees);

        // Transform the minted trees into the expected format
        const nfts = mintedTrees.map(tree => ({
            tree_id: tree.tree_id,
            metadata_uri: tree.metadata_uri,
            owner: tree.owner,
            created_at: tree.created_at || new Date().toISOString()
        }));
        
        console.log('Processed NFTs:', nfts);
        return nfts;
    } catch (error) {
        console.error('Error getting NFT collection:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            data: error.data
        });
        throw error;
    }
};

// Get NFT Details
export const getNFTDetails = async (tokenId) => {
    try {
        const resource = await aptos.getAccountResource({
            accountAddress: NFT_CONTRACT_ADDRESS,
            resourceType: `${NFT_CONTRACT_ADDRESS}::tree_nft::TreeNFT`
        });
        
        const token = resource.data.tokens.find(t => t.id === tokenId);
        return token || null;
    } catch (error) {
        console.error('Error getting NFT details:', error);
        throw error;
    }
};

// Delete NFT (by transferring to burn address)
export const deleteTreeNFT = async (treeId, wallet) => {
    try {
        if (!wallet) {
            throw new Error('Wallet is required');
        }

        if (!treeId) {
            throw new Error('Tree ID is required');
        }

        console.log('Starting NFT deletion process...');
        console.log('Contract address:', contractAddress);
        
        // Get the wallet account
        const account = await wallet.account();
        if (!account) {
            throw new Error('No account found in wallet');
        }
        console.log('Sender address:', account.address);

        // Burn address (address with all zeros)
        const burnAddress = "0x0000000000000000000000000000000000000000000000000000000000000000";

        // Create the transaction payload for transferring the NFT to burn address
        const payload = {
            function: `${contractAddress}::tree_nft::transfer_tree_nft`,
            type_arguments: [],
            arguments: [burnAddress, String(treeId)] // The Move function expects (to: address, tree_id: String)
        };

        console.log('Deleting NFT with payload:', {
            function: payload.function,
            arguments: payload.arguments,
            treeId: treeId
        });

        // Generate, sign, and submit transaction
        const pendingTxn = await wallet.signAndSubmitTransaction({
            payload: payload
        });
        console.log('Transaction submitted:', pendingTxn);

        if (!pendingTxn?.hash) {
            throw new Error('Transaction hash is missing from wallet response');
        }

        // Wait for transaction confirmation
        console.log('Waiting for transaction confirmation with hash:', pendingTxn.hash);
        const txResult = await aptos.waitForTransaction({
            transactionHash: pendingTxn.hash
        });
        console.log('Transaction confirmed:', txResult);

        return {
            success: true,
            transactionHash: pendingTxn.hash
        };
    } catch (error) {
        console.error('Error deleting NFT:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            data: error.data
        });
        throw new Error('Failed to delete NFT: ' + error.message);
    }
}; 