import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { connectWallet, isWalletConnected, getWallet } from '../../blockchain/utils/walletUtils';
import { mintTreeNFT } from '../../blockchain/services/nftService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaLeaf, FaSpinner, FaWallet, FaTree, FaMapMarkerAlt } from 'react-icons/fa';

const NFTMinting = ({ tree: propTree, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mintingStatus, setMintingStatus] = useState('idle');
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Use tree from props or location state
    const tree = propTree || location.state?.selectedTree;

    // If we're coming from the dashboard, we know the user owns the tree
    const isTreeOwned = true;

    const handleMint = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setMintingStatus('connecting');

            // Check wallet connection
            const connected = await isWalletConnected();
            if (!connected) {
                await connectWallet();
            }

            const wallet = getWallet();
            if (!wallet) {
                throw new Error('Wallet not connected');
            }

            // Verify we have an account
            const account = await wallet.account();
            if (!account) {
                throw new Error('No account found in wallet. Please connect your wallet first.');
            }

            setMintingStatus('minting');
            const result = await mintTreeNFT(tree, wallet);

            setMintingStatus('success');
            
            // Call onSuccess if provided
            onSuccess?.(result);

            // Navigate within NFT dashboard and switch to collection tab
            setTimeout(() => {
                navigate('/nft', { 
                    state: { 
                        mintSuccess: true,
                        mintedTree: tree.common_names?.english || tree.scientific_name
                    },
                    replace: true
                });
                // Use window.location.hash to trigger the tab switch
                window.location.hash = 'nft-grid';
            }, 2000);
        } catch (error) {
            console.error('Minting error:', error);
            setError(error.message || 'Failed to mint NFT');
            setMintingStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!tree) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-22">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div 
                        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6 relative">
                            <FaTree className="w-20 h-20 text-forest-green mx-auto" />
                            <div className="absolute inset-0 bg-forest-green/20 blur-3xl rounded-full" />
                        </div>
                        <h3 className="text-2xl font-bold text-forest-green mb-4">
                            No Tree Selected
                        </h3>
                        <p className="text-sage-green mb-8">
                            Please select a tree from your dashboard first.
                        </p>
                        <Link 
                            to="/dashboard" 
                            className="inline-flex items-center gap-2 bg-forest-green text-white px-8 py-4 rounded-2xl hover:bg-forest-green/90 transition-all duration-300 shadow-lg hover:shadow-forest-green/30"
                        >
                            <FaLeaf className="w-5 h-5" />
                            <span>Go to Dashboard</span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-22">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div 
                    className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header Section */}
                    <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-forest-green to-forest-green/90" />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                            <h3 className="text-3xl font-bold mb-2">Mint Your Tree NFT</h3>
                            <p className="text-cream/90 text-center max-w-lg">
                                Create a unique digital certificate for your tree adoption
                            </p>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-leaf-green/20 rounded-full translate-x-10 translate-y-20 blur-2xl" />
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        {error && (
                            <motion.div 
                                className="bg-red-50/80 backdrop-blur-sm text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </motion.div>
                        )}

                        {/* Tree Preview Card */}
                        <div className="bg-cream/20 rounded-2xl p-6 mb-8">
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
                                    <img 
                                        src={tree.images?.primary || tree.image || tree.selectedImage || tree.treeImage || '/placeholder-tree.jpg'} 
                                        alt={tree.scientific_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.log('Image load error:', e);
                                            e.target.src = '/placeholder-tree.jpg';
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-semibold text-forest-green mb-2">
                                        {tree.common_names?.english || tree.scientific_name}
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sage-green">
                                            <FaLeaf className="w-4 h-4" />
                                            <span>{tree.scientific_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sage-green">
                                            <FaMapMarkerAlt className="w-4 h-4" />
                                            <span>{tree.location?.address || 'Community Garden, Delhi'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-cream/20 rounded-2xl p-4">
                                <h5 className="font-medium text-forest-green mb-2">NFT Benefits</h5>
                                <ul className="text-sage-green space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-green" />
                                        Proof of ownership
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-green" />
                                        Track environmental impact
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-green" />
                                        Access exclusive features
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-cream/20 rounded-2xl p-4">
                                <h5 className="font-medium text-forest-green mb-2">Environmental Impact</h5>
                                <ul className="text-sage-green space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-green" />
                                        CO₂ absorption: 52kg/year
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-green" />
                                        Oxygen production
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-green" />
                                        Wildlife habitat support
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Mint Button */}
                        <motion.button
                            onClick={handleMint}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl text-white font-medium transition-all duration-300 flex items-center justify-center gap-3
                                ${isLoading
                                    ? 'bg-forest-green/50 cursor-not-allowed'
                                    : 'bg-forest-green hover:bg-forest-green/90 shadow-lg hover:shadow-forest-green/30'
                                }`}
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="w-5 h-5 animate-spin" />
                                    <span>
                                        {mintingStatus === 'connecting' ? 'Connecting Wallet...' : 'Minting NFT...'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <FaWallet className="w-5 h-5" />
                                    <span>Mint NFT</span>
                                </>
                            )}
                        </motion.button>

                        {mintingStatus === 'success' && (
                            <motion.div 
                                className="mt-6 bg-green-50/80 backdrop-blur-sm text-green-600 p-4 rounded-2xl flex items-center gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <FaLeaf className="w-5 h-5" />
                                <span>NFT minted successfully! Redirecting to your collection...</span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NFTMinting; 