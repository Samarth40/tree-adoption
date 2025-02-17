import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNFTCollection, deleteTreeNFT } from '../../blockchain/services/nftService';
import { getNFTMetadata, deleteNFTAssets } from '../../blockchain/services/cloudinaryService';
import { isWalletConnected, getWallet } from '../../blockchain/utils/walletUtils';
import { FaTrash, FaLeaf, FaMapMarkerAlt, FaCloudSun } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const NFTCard = ({ nft, onDelete, isDeleting }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Image container with gradient overlay */}
            <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                    src={imageError ? '/placeholder-tree.jpg' : nft.metadata.image}
                    alt={nft.metadata.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        console.log('Image load error for NFT:', nft.tree_id);
                        setImageError(true);
                    }}
                />
                {/* Delete button */}
                <button
                    onClick={() => onDelete(nft)}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 shadow-lg hover:bg-red-50 text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100 transform group-hover:scale-105"
                >
                    {isDeleting ? (
                        <div className="animate-spin h-5 w-5 border-2 border-red-500 rounded-full border-t-transparent" />
                    ) : (
                        <FaTrash className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-6 relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-forest-green transition-colors">
                    {nft.metadata.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {nft.metadata.description}
                </p>

                {/* Attributes with icons */}
                {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
                    <div className="space-y-3 mb-4">
                        {nft.metadata.attributes.map((attr, index) => (
                            <div key={index} className="flex items-center text-sm">
                                {attr.trait_type === 'Species' && <FaLeaf className="w-4 h-4 text-forest-green mr-2" />}
                                {attr.trait_type === 'Location' && <FaMapMarkerAlt className="w-4 h-4 text-blue-500 mr-2" />}
                                {attr.trait_type === 'Environmental Impact' && <FaCloudSun className="w-4 h-4 text-yellow-500 mr-2" />}
                                <span className="text-gray-500 mr-2">{attr.trait_type}:</span>
                                <span className="text-gray-900 font-medium">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Minting date with modern design */}
                <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 flex items-center justify-between">
                        <span>Minted on</span>
                        <span className="font-medium bg-gray-100 px-3 py-1 rounded-full">
                            {new Date(nft.metadata.created_at).toLocaleDateString()}
                        </span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const NFTCollection = () => {
    const [nfts, setNfts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingNftId, setDeletingNftId] = useState(null);
    const location = useLocation();
    const [showSuccess, setShowSuccess] = useState(false);
    const [mintedTreeName, setMintedTreeName] = useState('');

    useEffect(() => {
        // Check for mint success message in location state
        if (location.state?.mintSuccess) {
            setShowSuccess(true);
            setMintedTreeName(location.state.mintedTree || 'Tree');
            // Clear the success message after 5 seconds
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    useEffect(() => {
        loadNFTs();
    }, []);

    const loadNFTs = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const connected = await isWalletConnected();
            if (!connected) {
                setError('Please connect your wallet to view your NFTs');
                return;
            }

            const wallet = getWallet();
            if (!wallet) {
                setError('Wallet not found');
                return;
            }

            // Get the wallet account
            const account = await wallet.account();
            if (!account || !account.address) {
                setError('No account found in wallet. Please connect your wallet first.');
                return;
            }

            console.log('Fetching NFTs for account:', account.address);
            const collection = await getNFTCollection(account.address);
            console.log('Received NFT collection:', collection);
            
            if (!collection || collection.length === 0) {
                console.log('No NFTs found in collection');
                setNfts([]);
                return;
            }

            // Fetch metadata for each NFT
            const nftPromises = collection.map(async (nft) => {
                try {
                    console.log('Fetching metadata for NFT:', nft);
                    if (!nft.metadata_uri) {
                        console.error('No metadata URI for NFT:', nft.tree_id);
                        return null;
                    }

                    const metadata = await getNFTMetadata(nft.metadata_uri);
                    if (!metadata) {
                        console.log('Skipping NFT due to missing metadata:', nft.tree_id);
                        return null;
                    }

                    return {
                        ...nft,
                        metadata: {
                            name: metadata.name || `Tree NFT #${nft.tree_id}`,
                            description: metadata.description || 'A unique tree NFT',
                            image: metadata.image || '/placeholder-tree.jpg',
                            attributes: Array.isArray(metadata.attributes) ? metadata.attributes : [],
                            created_at: metadata.created_at || nft.created_at || new Date().toISOString()
                        }
                    };
                } catch (error) {
                    console.error('Error fetching metadata for NFT:', nft.tree_id, error);
                    return null;
                }
            });

            const nftsWithMetadata = (await Promise.all(nftPromises)).filter(Boolean);
            console.log('NFTs with metadata:', nftsWithMetadata);

            setNfts(nftsWithMetadata);
        } catch (error) {
            console.error('Error loading NFTs:', error);
            setError(error.message || 'Failed to load NFTs. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (nft) => {
        try {
            if (!window.confirm(`Are you sure you want to delete "${nft.metadata.name}"? This action cannot be undone.`)) {
                return;
            }

            setDeletingNftId(nft.tree_id);
            const wallet = getWallet();
            
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            console.log('Starting NFT deletion process for:', nft);

            // First, try to delete from Cloudinary
            try {
                await deleteNFTAssets({
                    metadata_uri: nft.metadata_uri,
                    image: nft.metadata.image
                });
                console.log('Successfully deleted NFT assets from Cloudinary');
            } catch (cloudinaryError) {
                console.error('Error deleting from Cloudinary:', cloudinaryError);
                // Continue with blockchain deletion even if Cloudinary deletion fails
            }

            // Then, delete from blockchain
            await deleteTreeNFT(nft.tree_id, wallet);
            console.log('Successfully deleted NFT from blockchain');
            
            // Remove the deleted NFT from the state with animation
            setNfts(prevNfts => prevNfts.filter(n => n.tree_id !== nft.tree_id));
            
            // Show success message
            alert('NFT successfully deleted from your collection!');
        } catch (error) {
            console.error('Error deleting NFT:', error);
            alert('Failed to delete NFT: ' + error.message);
        } finally {
            setDeletingNftId(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Success Message */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-green-50 text-green-600 p-4 rounded-lg mb-8 flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Successfully minted NFT for {mintedTreeName}!</span>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="text-green-500 hover:text-green-600"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">My Tree NFT Collection</h2>
                <div className="text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                    {nfts.length} {nfts.length === 1 ? 'Tree' : 'Trees'}
                </div>
            </div>

            {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
                </div>
            ) : error ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={loadNFTs}
                            className="px-6 py-3 bg-forest-green text-white rounded-full hover:bg-forest-green/90 transition-all duration-300 transform hover:scale-105"
                        >
                            Retry Loading
                        </button>
                    </div>
                </div>
            ) : nfts.length === 0 ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">No NFTs Found</h3>
                        <p className="text-gray-600 mb-6">You haven't minted any tree NFTs yet.</p>
                        <button
                            onClick={() => window.location.href = '/mint'}
                            className="px-6 py-3 bg-forest-green text-white rounded-full hover:bg-forest-green/90 transition-all duration-300 transform hover:scale-105"
                        >
                            Mint Your First Tree NFT
                        </button>
                    </div>
                </div>
            ) : (
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {nfts.map((nft) => (
                            <NFTCard
                                key={nft.tree_id}
                                nft={nft}
                                onDelete={handleDelete}
                                isDeleting={deletingNftId === nft.tree_id}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default NFTCollection; 