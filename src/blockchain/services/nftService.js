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
    
    // More flexible image path handling
    const image = tree.images?.primary || tree.image || tree.imageUrl || tree.image_url || null;

    if (!image) {
        console.error('Tree data:', tree);
        throw new Error('Tree image is required. Please provide an image URL in one of these formats: images.primary, image, imageUrl, or image_url');
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

            // 3. Create the transaction payload for minting
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

// Initialize NFT Collection
const initializeNFTCollection = async (wallet) => {
    try {
        if (!wallet) {
            throw new Error('Wallet is required');
        }

        console.log('Initializing NFT collection...');
        
        // Create the transaction payload for minting
        const payload = {
            function: `${NFT_CONTRACT_ADDRESS}::tree_nft::mint_tree_nft`,
            type_arguments: [],
            arguments: ["init_collection", "https://example.com/init", "0"]
        };

        console.log('Submitting initialization transaction...');
        const transaction = await wallet.signAndSubmitTransaction({
            payload: payload
        });
        console.log('Initialization transaction submitted:', transaction);
        
        // Wait for transaction
        const result = await aptos.waitForTransaction({ transactionHash: transaction.hash });
        console.log('Initialization complete:', result);
        
        return result;
    } catch (error) {
        console.error('Error initializing NFT collection:', error);
        throw error;
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

        // Get the NFT collection resource from the contract account
        const resources = await aptos.getAccountResources({
            accountAddress: NFT_CONTRACT_ADDRESS
        });
        console.log('Found contract resources:', resources.length);
        
        // Log all resource types for debugging
        console.log('Available resource types:', resources.map(r => r.type));

        // Find the NFT collection resource
        const expectedType = `${NFT_CONTRACT_ADDRESS}::tree_nft::TreeNFTCollection`;
        console.log('Looking for resource type:', expectedType);
        
        const nftResource = resources.find(r => r.type === expectedType);
        
        if (!nftResource) {
            console.log('No NFT collection found in contract');
            return [];
        }
        
        console.log('Found NFT resource:', nftResource);
        console.log('NFT data:', nftResource.data);
        
        // Use minted_trees array and filter for the specific address
        const mintedTrees = nftResource.data.minted_trees || [];
        console.log('Found minted trees:', mintedTrees);

        // Filter NFTs owned by the specified address
        const userNfts = mintedTrees
            .filter(tree => {
                const isOwner = tree.owner.toLowerCase() === addressStr.toLowerCase();
                if (!isOwner) {
                    console.log('Filtering out NFT not owned by user:', tree.tree_id);
                }
                return isOwner;
            })
            .map(tree => ({
                tree_id: tree.tree_id,
                metadata_uri: tree.metadata_uri,
                owner: tree.owner,
                created_at: tree.minting_date ? new Date(tree.minting_date * 1000).toISOString() : new Date().toISOString()
            }));
        
        console.log('Processed NFTs for user:', userNfts);
        return userNfts;
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
            resourceType: `${NFT_CONTRACT_ADDRESS}::tree_adoption::tree_nft::TreeNFT`
        });
        
        const token = resource.data.tokens.find(t => t.id === tokenId);
        return token || null;
    } catch (error) {
        console.error('Error getting NFT details:', error);
        throw error;
    }
};

// Delete NFT (by burning it)
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
        console.log('Tree ID to delete:', treeId);
        
        // Get the wallet account
        const account = await wallet.account();
        if (!account) {
            throw new Error('No account found in wallet');
        }
        console.log('Sender address:', account.address);

        // First verify the NFT exists and is owned by the sender
        const collection = await getNFTCollection(account.address);
        const nftToDelete = collection.find(nft => nft.tree_id === treeId);
        
        if (!nftToDelete) {
            throw new Error('NFT not found in your collection');
        }

        // Convert addresses to lowercase for comparison
        const ownerAddress = nftToDelete.owner.toLowerCase();
        const senderAddress = account.address.toLowerCase();
        
        console.log('NFT owner address:', ownerAddress);
        console.log('Sender address:', senderAddress);

        if (ownerAddress !== senderAddress) {
            throw new Error(`You do not own this NFT. Owner: ${ownerAddress}, Sender: ${senderAddress}`);
        }

        // Create the transaction payload for burning the NFT
        const payload = {
            function: `${contractAddress}::tree_nft::transfer_tree_nft`,
            type_arguments: [],
            arguments: ["0x0000000000000000000000000000000000000000000000000000000000000000", treeId]
        };

        console.log('Burning NFT with payload:', {
            function: payload.function,
            arguments: payload.arguments,
            treeId: treeId,
            from: account.address
        });

        try {
            // Generate, sign, and submit transaction
            console.log('Submitting burn transaction...');
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

            // Try to delete from Cloudinary after successful blockchain deletion
            if (nftToDelete.metadata_uri) {
                try {
                    await deleteNFTAssets({
                        metadata_uri: nftToDelete.metadata_uri,
                        image: nftToDelete.metadata?.image
                    });
                    console.log('Successfully deleted NFT assets from Cloudinary');
                } catch (cloudinaryError) {
                    console.warn('Failed to delete from Cloudinary, but NFT was burned:', cloudinaryError);
                }
            }

            return {
                success: true,
                transactionHash: pendingTxn.hash
            };
        } catch (txError) {
            console.error('Detailed transaction error:', {
                message: txError.message,
                data: txError.data,
                stack: txError.stack
            });
            throw new Error(`Transaction failed: ${txError.message}`);
        }
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