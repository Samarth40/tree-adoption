import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNFTCollection, deleteTreeNFT } from '../../blockchain/services/nftService';
import { getNFTMetadata, deleteNFTAssets } from '../../blockchain/services/cloudinaryService';
import { isWalletConnected, getWallet } from '../../blockchain/utils/walletUtils';
import { FaTrash, FaLeaf, FaMapMarkerAlt, FaCloudSun, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

// Toast Component
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3 ${
            type === 'success' 
                ? 'bg-green-50/90 text-green-600' 
                : type === 'error'
                ? 'bg-red-50/90 text-red-600'
                : 'bg-forest-green/90 text-white'
        }`}
    >
        {type === 'success' ? (
            <FaCheck className="w-5 h-5" />
        ) : type === 'error' ? (
            <FaTimes className="w-5 h-5" />
        ) : (
            <FaSpinner className="w-5 h-5 animate-spin" />
        )}
        <span className="font-medium">{message}</span>
        <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-black/10 rounded-lg transition-colors"
        >
            <FaTimes className="w-4 h-4" />
        </button>
    </motion.div>
);

const NFTCard = ({ nft, onDelete, isDeleting }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.3)] hover:-translate-y-2"
        >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-forest-green/20 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-leaf-green/20 to-transparent rounded-full translate-x-8 translate-y-8 blur-2xl" />

            {/* Image container with gradient overlay */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-forest-green/90 via-forest-green/20 to-transparent z-10" />
                <img
                    src={imageError ? '/placeholder-tree.jpg' : nft.metadata.image}
                    alt={nft.metadata.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        console.log('Image load error for NFT:', nft.tree_id);
                        setImageError(true);
                    }}
                />
                {/* Delete button */}
                <button
                    onClick={() => onDelete(nft)}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 z-20 p-3 rounded-xl bg-white/80 backdrop-blur-md hover:bg-red-500 text-forest-green hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-105"
                >
                    {isDeleting ? (
                        <FaSpinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <FaTrash className="h-4 w-4" />
                    )}
                </button>

                {/* Title overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-forest-green/90 to-transparent">
                    <h3 className="text-xl font-bold text-white mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {nft.metadata.name}
                    </h3>
                    <p className="text-cream text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {nft.metadata.description}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 relative z-10">
                {/* Attributes with modern design */}
                {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {nft.metadata.attributes.map((attr, index) => (
                            <div key={index} className="relative overflow-hidden">
                                <div className="flex items-center gap-3 bg-cream/30 backdrop-blur-sm p-3 rounded-xl hover:bg-cream/50 transition-colors duration-300 group/attr">
                                    {attr.trait_type === 'Species' && (
                                        <div className="p-2 bg-forest-green text-white rounded-lg transform group-hover/attr:rotate-12 transition-transform duration-300">
                                            <FaLeaf className="w-4 h-4" />
                                        </div>
                                    )}
                                    {attr.trait_type === 'Location' && (
                                        <div className="p-2 bg-sage-green text-white rounded-lg transform group-hover/attr:rotate-12 transition-transform duration-300">
                                            <FaMapMarkerAlt className="w-4 h-4" />
                                        </div>
                                    )}
                                    {attr.trait_type === 'Environmental Impact' && (
                                        <div className="p-2 bg-leaf-green text-white rounded-lg transform group-hover/attr:rotate-12 transition-transform duration-300">
                                            <FaCloudSun className="w-4 h-4" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-forest-green/70 text-xs uppercase tracking-wider mb-0.5">{attr.trait_type}</p>
                                        <p className="text-forest-green font-medium text-sm">{attr.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Minting date with modern design */}
                <div className="pt-2 border-t border-forest-green/10">
                    <div className="flex items-center justify-between">
                        <span className="text-forest-green/70 uppercase tracking-wider text-xs">Minted on</span>
                        <span className="px-3 py-1 bg-forest-green text-white rounded-lg text-sm font-medium">
                            {new Date(nft.metadata.created_at).toLocaleDateString()}
                        </span>
                    </div>
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
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [mintedTreeName, setMintedTreeName] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // Handle hash-based navigation
        if (location.hash === '#nft-grid') {
            const element = document.getElementById('nft-grid');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.hash, nfts]); // Add nfts as dependency to ensure content is loaded

    useEffect(() => {
        if (location.state?.mintSuccess) {
            setShowSuccess(true);
            setMintedTreeName(location.state.mintedTree || 'Tree');
            // Clear the location state to prevent re-showing the success message
            navigate(location.pathname + location.hash, { replace: true });
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location, navigate]);

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

            const account = await wallet.account();
            if (!account || !account.address) {
                setError('No account found in wallet. Please connect your wallet first.');
                return;
            }

            console.log('Fetching NFTs for account:', account.address);
            console.log('Using contract address:', import.meta.env.VITE_NFT_CONTRACT_ADDRESS);
            
            const collection = await getNFTCollection(account.address);
            console.log('Raw NFT collection response:', collection);
            
            if (!collection || collection.length === 0) {
                setNfts([]);
                return;
            }

            const nftPromises = collection.map(async (nft) => {
                try {
                    if (!nft.metadata_uri) {
                        return null;
                    }

                    const metadata = await getNFTMetadata(nft.metadata_uri);
                    if (!metadata) {
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
            setNfts(nftsWithMetadata);
        } catch (error) {
            console.error('Detailed error in loadNFTs:', error);
            console.error('Error stack:', error.stack);
            setError(error.message || 'Failed to load NFTs. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (nft) => {
        try {
            setToast({
                message: `Are you sure you want to delete "${nft.metadata.name}"?`,
                type: 'confirm',
                onConfirm: async () => {
                    try {
                        setDeletingNftId(nft.tree_id);
                        setToast({ message: 'Deleting NFT...', type: 'loading' });
                        
                        const wallet = getWallet();
                        if (!wallet) {
                            throw new Error('Wallet not found');
                        }

                        try {
                            await deleteNFTAssets({
                                metadata_uri: nft.metadata_uri,
                                image: nft.metadata.image
                            });
                        } catch (cloudinaryError) {
                            console.error('Error deleting from Cloudinary:', cloudinaryError);
                        }

                        await deleteTreeNFT(nft.tree_id, wallet);
                        setNfts(prevNfts => prevNfts.filter(n => n.tree_id !== nft.tree_id));
                        
                        setToast({
                            message: 'NFT successfully deleted from your collection!',
                            type: 'success'
                        });
                        
                        setTimeout(() => setToast(null), 3000);
                    } catch (error) {
                        console.error('Error deleting NFT:', error);
                        setToast({
                            message: 'Failed to delete NFT: ' + error.message,
                            type: 'error'
                        });
                    } finally {
                        setDeletingNftId(null);
                    }
                },
                onCancel: () => setToast(null)
            });
        } catch (error) {
            console.error('Error in delete handler:', error);
            setToast({
                message: 'Error: ' + error.message,
                type: 'error'
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-4 bg-gradient-to-b from-cream to-white min-h-screen">
            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    toast.type === 'confirm' ? (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-4 right-4 z-50 p-6 rounded-xl shadow-lg bg-white/90 backdrop-blur-md"
                        >
                            <p className="text-gray-800 mb-4">{toast.message}</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={toast.onCancel}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={toast.onConfirm}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )
                )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-r from-forest-green to-leaf-green text-white p-6 rounded-2xl mb-4 flex items-center justify-between shadow-[0_10px_30px_-15px_rgba(34,197,94,0.3)]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <FaLeaf className="h-7 w-7" />
                            </div>
                            <span className="text-xl font-medium">Successfully minted NFT for {mintedTreeName}!</span>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <FaTimes className="h-6 w-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">My Tree NFT Collection</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                            {nfts.length} {nfts.length === 1 ? 'Tree' : 'Trees'}
                        </div>
                        <button
                            onClick={loadNFTs}
                            className="bg-forest-green text-white px-4 py-2 rounded-full hover:bg-forest-green/90 transition-all duration-300 flex items-center gap-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="relative">
                            <FaSpinner className="w-20 h-20 text-forest-green animate-spin" />
                            <div className="absolute inset-0 bg-forest-green/20 blur-3xl rounded-full" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="text-center max-w-lg mx-auto">
                            <div className="bg-red-50/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
                                <p className="text-red-600 text-xl mb-6">{error}</p>
                                <motion.button
                                    onClick={loadNFTs}
                                    className="px-8 py-4 bg-forest-green text-white rounded-2xl hover:bg-forest-green/90 transition-all duration-300 shadow-lg hover:shadow-forest-green/30 text-lg font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Retry Loading
                                </motion.button>
                            </div>
                        </div>
                    </div>
                ) : nfts.length === 0 ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="text-center max-w-lg mx-auto">
                            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
                                <div className="mb-8 relative">
                                    <FaLeaf className="w-24 h-24 text-forest-green mx-auto" />
                                    <div className="absolute inset-0 bg-forest-green/20 blur-3xl rounded-full" />
                                </div>
                                <h3 className="text-3xl font-bold text-forest-green mb-4">No NFTs Found</h3>
                                <p className="text-sage-green text-xl mb-10">You haven't minted any tree NFTs yet.</p>
                                <motion.button
                                    onClick={() => window.location.href = '/mint'}
                                    className="px-10 py-5 bg-forest-green text-white rounded-2xl hover:bg-forest-green/90 transition-all duration-300 shadow-lg hover:shadow-forest-green/30 text-lg font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Mint Your First Tree NFT
                                </motion.button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence>
                        <div id="nft-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </AnimatePresence>
        </div>
    );
};

export default NFTCollection; 