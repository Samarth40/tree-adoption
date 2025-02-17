import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { connectWallet, isWalletConnected, getWallet } from '../../blockchain/utils/walletUtils';
import { mintTreeNFT } from '../../blockchain/services/nftService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

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

            // Navigate to NFT collection after successful minting
            setTimeout(() => {
                navigate('/nft-collection', { 
                    state: { 
                        mintSuccess: true,
                        mintedTree: tree.common_names?.english || tree.scientific_name
                    }
                });
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
            <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <h3 className="text-2xl font-bold text-forest-green mb-4">
                            No Tree Selected
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Please select a tree from your dashboard first.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                to="/dashboard" 
                                className="inline-block bg-forest-green text-white px-6 py-3 rounded-xl hover:bg-forest-green/90 transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream to-white pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-forest-green mb-2">
                            Mint Your Tree NFT
                        </h3>
                        <p className="text-gray-600">
                            Create a digital certificate of your tree adoption
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-cream/30 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Tree Details</h4>
                            <p className="text-gray-600">Species: {tree.scientific_name || 'Not specified'}</p>
                            <p className="text-gray-600">Location: {tree.location?.address || 'Community Garden, Delhi'}</p>
                        </div>

                        <div className="bg-cream/30 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">NFT Benefits</h4>
                            <ul className="text-gray-600 space-y-2">
                                <li>• Proof of tree adoption ownership</li>
                                <li>• Track environmental impact</li>
                                <li>• Access to exclusive community features</li>
                            </ul>
                        </div>

                        <motion.button
                            onClick={handleMint}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl text-white font-medium transition-all
                                ${isLoading
                                    ? 'bg-forest-green/50 cursor-not-allowed'
                                    : 'bg-forest-green hover:bg-forest-green/90'
                                }`}
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {mintingStatus === 'connecting' ? 'Connecting Wallet...' : 'Minting NFT...'}
                                </div>
                            ) : (
                                'Mint NFT'
                            )}
                        </motion.button>

                        {mintingStatus === 'success' && (
                            <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                                NFT minted successfully! Redirecting to your NFT collection...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NFTMinting; 