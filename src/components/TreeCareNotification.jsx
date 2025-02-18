import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaWater, FaTemperatureHigh, FaTimes, FaSeedling, FaCloudSun, FaTree } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TreeCareNotification = ({ adoptedTrees }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && adoptedTrees?.length > 0) {
            // Generate notifications based on adopted trees
            const treeNotifications = adoptedTrees.flatMap((tree, index) => {
                const treeNotifs = [];
                const today = new Date();
                const lastMaintenance = new Date(tree.lastMaintenance);
                const daysSinceLastMaintenance = Math.floor((today - lastMaintenance) / (1000 * 60 * 60 * 24));

                // Water notification if needed (based on species characteristics)
                if (tree.care_details?.watering_frequency === 'frequent' || daysSinceLastMaintenance > 7) {
                    treeNotifs.push({
                        id: `water-${tree.id}`,
                        type: 'water',
                        icon: <FaWater className="text-blue-500" />,
                        title: 'Watering Needed',
                        message: `${tree.common_names?.english || tree.scientific_name} needs watering.`,
                        priority: 'high',
                        tree: tree
                    });
                }

                // Health check notification (monthly)
                if (daysSinceLastMaintenance > 30) {
                    treeNotifs.push({
                        id: `health-${tree.id}`,
                        type: 'health',
                        icon: <FaLeaf className="text-forest-green" />,
                        title: 'Health Check Due',
                        message: `Time for monthly health check of your ${tree.common_names?.english || tree.scientific_name}.`,
                        priority: 'medium',
                        tree: tree
                    });
                }

                // Environmental impact notification
                if (tree.environmental_impact?.co2_absorption_rate) {
                    treeNotifs.push({
                        id: `impact-${tree.id}`,
                        type: 'impact',
                        icon: <FaCloudSun className="text-yellow-500" />,
                        title: 'Environmental Impact',
                        message: `Your ${tree.common_names?.english || tree.scientific_name} has absorbed approximately ${tree.environmental_impact.co2_absorption_rate}kg of CO2!`,
                        priority: 'low',
                        tree: tree
                    });
                }

                return treeNotifs;
            });

            setNotifications(treeNotifications);
            setIsVisible(true);

            // Hide notifications after 15 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [currentUser, adoptedTrees]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    const handleNotificationClick = (notification) => {
        // Navigate to tree chat page with the tree data
        navigate('/tree-chat', { state: { tree: notification.tree } });
    };

    if (!currentUser || !isVisible || notifications.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
            >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-forest-green/10 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-forest-green to-emerald-600 px-4 py-3 flex items-center justify-between">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <FaTree />
                            Tree Care Dashboard
                        </h3>
                        <button
                            onClick={handleDismiss}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        {notification.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {notification.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium
                                        ${notification.priority === 'high' ? 'bg-red-100 text-red-600' :
                                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-green-100 text-green-600'}`}
                                    >
                                        {notification.priority}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TreeCareNotification; 