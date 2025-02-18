import React, { useState, useEffect } from 'react';
import NFTMinting from '../components/NFT/NFTMinting';
import NFTCollection from '../components/NFT/NFTCollection';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const NFTDashboard = () => {
    const [activeTab, setActiveTab] = useState('mint');
    const [selectedTree, setSelectedTree] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // First try to get tree from location state
        if (location.state?.selectedTree) {
            setSelectedTree(location.state.selectedTree);
            return;
        }

        // If not in location state, try localStorage
        const savedTree = localStorage.getItem('selectedTree');
        if (savedTree) {
            try {
                setSelectedTree(JSON.parse(savedTree));
            } catch (error) {
                console.error('Error parsing saved tree:', error);
            }
        }
    }, [location.state]);

    const handleMintSuccess = () => {
        // Switch to collection tab after successful minting
        setActiveTab('collection');
        // Clear selected tree
        setSelectedTree(null);
        localStorage.removeItem('selectedTree');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-forest-green mb-2">Tree NFT Dashboard</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Mint NFTs for your adopted trees and view your collection
                    </p>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex justify-center space-x-4 mb-4">
                    <button
                        onClick={() => setActiveTab('mint')}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors
                            ${activeTab === 'mint'
                                ? 'bg-forest-green text-white'
                                : 'bg-white text-forest-green hover:bg-forest-green/5'
                            }`}
                    >
                        Mint NFT
                    </button>
                    <button
                        onClick={() => setActiveTab('collection')}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors
                            ${activeTab === 'collection'
                                ? 'bg-forest-green text-white'
                                : 'bg-white text-forest-green hover:bg-forest-green/5'
                            }`}
                    >
                        My Collection
                    </button>
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2"
                >
                    {activeTab === 'mint' ? (
                        <div className="max-w-2xl mx-auto">
                            {!selectedTree ? (
                                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                    <h3 className="text-xl font-semibold text-forest-green mb-4">
                                        Ready to Mint Your Tree NFT?
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        First, select a tree from your dashboard to mint it as an NFT.
                                    </p>
                                    <motion.div>
                                        <Link
                                            to="/dashboard"
                                            className="inline-block px-6 py-3 bg-forest-green text-white rounded-xl hover:bg-forest-green/90 transition-colors"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    </motion.div>
                                </div>
                            ) : (
                                <NFTMinting
                                    tree={selectedTree}
                                    onSuccess={handleMintSuccess}
                                />
                            )}
                        </div>
                    ) : (
                        <NFTCollection />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default NFTDashboard; 