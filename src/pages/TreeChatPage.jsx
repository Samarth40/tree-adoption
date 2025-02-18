import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaHeart, FaCloudSun } from 'react-icons/fa';
import TreeChat from '../components/TreeChat';

const TreeInfoCard = ({ tree }) => (
    <div className="h-full flex flex-col">
        {/* Tree Image */}
        <div className="aspect-video rounded-t-2xl overflow-hidden">
            <img
                src={tree.image || '/placeholder-tree.jpg'}
                alt={tree.common_names?.english || tree.scientific_name}
                className="w-full h-full object-cover"
            />
        </div>

        {/* Tree Info Content */}
        <div className="flex-1 p-6 flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {tree.common_names?.english || 'Bird\'s Nest Fern'}
                </h2>
                <p className="text-sm text-forest-green font-medium">
                    {tree.scientific_name || 'Asplenium heterochroum Kunze'}
                </p>
            </div>

            <div className="flex-1 space-y-4 my-6">
                <div className="flex items-start gap-3 p-4 bg-forest-green/5 rounded-xl">
                    <FaMapMarkerAlt className="w-5 h-5 text-forest-green mt-1" />
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Location</h4>
                        <p className="text-sm text-gray-600">
                            {tree.location?.address || 'Community Garden, Delhi'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-forest-green/5 rounded-xl">
                    <FaHeart className="w-5 h-5 text-forest-green mt-1" />
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Health Status</h4>
                        <p className="text-sm text-gray-600">
                            {tree.health || 'Excellent'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-forest-green/5 rounded-xl">
                    <FaCloudSun className="w-5 h-5 text-forest-green mt-1" />
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Environmental Impact</h4>
                        <p className="text-sm text-gray-600">
                            {tree.characteristics?.environmental_benefits?.co2_absorption_rate || '52'}kg CO2/year
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-forest-green/10 text-forest-green px-4 py-3 rounded-xl 
                         hover:bg-forest-green hover:text-white transition-all duration-300 
                         flex items-center justify-center gap-2 font-medium"
            >
                Back to Dashboard
            </button>
        </div>
    </div>
);

const TreeChatPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [tree, setTree] = useState(null);

    useEffect(() => {
        if (!location.state?.tree) {
            navigate('/dashboard');
            return;
        }
        setTree(location.state.tree);
    }, [location.state, navigate]);

    if (!tree) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8 mb-8">
                    {/* Tree Info Card */}
                    <div className="col-span-1 pl-32 h-[calc(100vh-14rem)]">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full"
                        >
                            <TreeInfoCard tree={tree} />
                        </motion.div>
                    </div>

                    {/* Chat Card */}
                    <div className="col-span-2 pr-32 h-[calc(100vh-14rem)]">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full"
                        >
                            <TreeChat tree={tree} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreeChatPage; 