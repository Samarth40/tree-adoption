import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import TreeImage from '../components/TreeImage';
import PaymentForm from '../components/PaymentForm';
import stripeService from '../services/stripeService';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';

const AdoptionPage = () => {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tree, setTree] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    adoptionDuration: '1',
    giftOption: false,
    giftRecipientName: '',
    giftMessage: '',
  });

  // Fetch tree data from localStorage
  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setLoading(true);
        console.log('Getting tree data from localStorage');
        
        // Get tree data from localStorage
        const storedTree = localStorage.getItem('selectedTree');
        if (!storedTree) {
          throw new Error('No tree data found');
        }

        const treeData = JSON.parse(storedTree);
        console.log('Successfully loaded tree data:', treeData);
        
        setTree(treeData);
        setError(null);
      } catch (err) {
        console.error('Error loading tree data:', err);
        setError('Failed to load tree data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTreeData();
  }, [treeId]);

  const adoptionPlans = [
    { duration: '1', price: 199, label: '1 Year' },
    { duration: '2', price: 379, label: '2 Years', savings: '5%' },
    { duration: '5', price: 899, label: '5 Years', savings: '10%' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Starting adoption process after payment success', { paymentIntent });
      
      if (!db) {
        throw new Error('Database not initialized');
      }

      // Get the selected plan
      const selectedPlan = adoptionPlans.find(plan => plan.duration === formData.adoptionDuration);
      if (!selectedPlan) {
        throw new Error('Invalid adoption duration selected');
      }
      console.log('Selected plan:', selectedPlan);

      // Verify user and tree data
      if (!currentUser || !currentUser.uid) {
        throw new Error('User not authenticated');
      }
      console.log('Current user:', currentUser.uid);

      if (!tree) {
        throw new Error('Tree data not found');
      }
      console.log('Tree data:', tree);

      // Prepare adoption data
      const adoptionData = {
        userId: currentUser.uid,
        treeId: tree.id,
        treeName: tree.common_names?.english || tree.species?.common_name,
        species: tree.species?.scientific_name || tree.scientific_name,
        adoptionDate: serverTimestamp(),
        duration: parseInt(formData.adoptionDuration),
        amount: selectedPlan.price,
        paymentId: paymentIntent.id,
        status: 'active',
        location: tree.location?.address || 'Community Garden, Delhi',
        health: tree.health_metrics?.overall_health || 'Excellent',
        lastMaintenance: serverTimestamp(),
        progress: tree.health_metrics?.growth_progress || 85,
        images: tree.images,
        characteristics: tree.characteristics,
        environmental_benefits: tree.characteristics?.environmental_benefits,
        userDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        giftDetails: formData.giftOption ? {
          recipientName: formData.giftRecipientName,
          message: formData.giftMessage
        } : null,
        maintenanceSchedule: [
          {
            type: 'watering',
            frequency: 'weekly',
            nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          {
            type: 'health_check',
            frequency: 'monthly',
            nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Preparing to save adoption data:', adoptionData);

      // Save adoption data to Firestore
      let adoptionDocRef;
      try {
        const adoptionsRef = collection(db, 'adoptions');
        adoptionDocRef = await addDoc(adoptionsRef, adoptionData);
        console.log('Adoption data saved successfully with ID:', adoptionDocRef.id);
      } catch (firestoreError) {
        console.error('Error saving adoption data:', firestoreError);
        throw new Error(`Failed to save adoption data: ${firestoreError.message}`);
      }

      // Update user's data in Firestore
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        const userData = {
          email: currentUser.email,
          displayName: currentUser.displayName || `${formData.firstName} ${formData.lastName}`,
          updatedAt: serverTimestamp(),
          treesPlanted: increment(1),
          totalImpact: increment(52 * parseInt(formData.adoptionDuration))
        };

        if (!userDoc.exists()) {
          // Create new user document
          userData.createdAt = serverTimestamp();
          userData.treesPlanted = 1;
          userData.totalImpact = 52 * parseInt(formData.adoptionDuration);
          userData.isProfileComplete = true;
          
          await setDoc(userRef, userData);
          console.log('Created new user document');
        } else {
          // Update existing user document
          await updateDoc(userRef, userData);
          console.log('Updated existing user document');
        }
      } catch (userUpdateError) {
        console.error('Error updating user data:', userUpdateError);
        // Continue with navigation since adoption is saved
      }

      // Update tree status in Firestore
      try {
        const treeRef = doc(db, 'trees', tree.id);
        await updateDoc(treeRef, {
          status: 'adopted',
          adoptedBy: currentUser.uid,
          adoptedAt: serverTimestamp(),
          lastUpdated: serverTimestamp()
        });
        console.log('Updated tree status');
      } catch (treeUpdateError) {
        console.error('Error updating tree status:', treeUpdateError);
      }

      // Prepare navigation state
      const navigationState = {
        treeName: tree.common_names?.english || tree.species?.common_name,
        amount: selectedPlan.price,
        duration: formData.adoptionDuration,
        paymentId: paymentIntent.id,
        adoptionDetails: {
          location: tree.location?.address || 'Community Garden, Delhi',
          impact: `${52 * parseInt(formData.adoptionDuration)}kg CO₂ per year`,
          species: tree.species?.scientific_name || tree.scientific_name,
          adoptionId: adoptionDocRef.id
        }
      };

      console.log('Navigation state prepared:', navigationState);

      // Navigate to success page
      navigate('/adoption/success', {
        replace: true,
        state: navigationState
      });
    } catch (error) {
      console.error('Error in handlePaymentSuccess:', error);
      setError(`Error processing adoption: ${error.message}. Please contact support.`);
      alert(`Error processing adoption: ${error.message}. Please contact support.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Handle payment error appropriately
  };

  if (!tree) return null;

  const selectedPlan = adoptionPlans.find(plan => plan.duration === formData.adoptionDuration);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-forest-green text-white px-6 py-2 rounded-lg hover:bg-forest-green/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Tree Preview */}
          <div className="relative h-48 md:h-64 bg-forest-green/10">
            <TreeImage
              src={tree.images.primary}
              alt={tree.common_names.english || tree.scientific_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">
                Adopt a {tree.common_names.english || tree.scientific_name.split(' ')[0]}
              </h1>
              <p className="text-white/80 italic">{tree.scientific_name}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Adoption Form */}
              <div>
                <h2 className="text-2xl font-bold text-forest-green mb-6">
                  {showPayment ? 'Complete Payment' : 'Adoption Details'}
                </h2>
                
                {!showPayment ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows="3"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Adoption Duration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Choose Adoption Duration</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {adoptionPlans.map((plan) => (
                          <label
                            key={plan.duration}
                            className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.adoptionDuration === plan.duration
                                ? 'border-forest-green bg-forest-green/5'
                                : 'border-gray-200 hover:border-forest-green/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="adoptionDuration"
                              value={plan.duration}
                              checked={formData.adoptionDuration === plan.duration}
                              onChange={handleInputChange}
                              className="absolute opacity-0"
                            />
                            <span className="text-lg font-semibold text-forest-green">{plan.label}</span>
                            <span className="text-2xl font-bold text-gray-900">₹{plan.price}</span>
                            {plan.savings && (
                              <span className="text-sm text-green-600">Save {plan.savings}</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Gift Option */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="giftOption"
                          checked={formData.giftOption}
                          onChange={handleInputChange}
                          className="rounded text-forest-green focus:ring-forest-green"
                        />
                        <span className="text-gray-700">This is a gift</span>
                      </label>

                      {formData.giftOption && (
                        <div className="space-y-4 pl-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Recipient's Name
                            </label>
                            <input
                              type="text"
                              name="giftRecipientName"
                              value={formData.giftRecipientName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Gift Message
                            </label>
                            <textarea
                              name="giftMessage"
                              value={formData.giftMessage}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                              placeholder="Add a personal message..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-forest-green text-white py-4 rounded-xl text-lg font-medium hover:bg-forest-green/90 transition-colors"
                    >
                      Proceed to Payment • ₹{selectedPlan.price}
                    </button>
                  </form>
                ) : (
                  <Elements stripe={stripeService.getStripe()}>
                    <PaymentForm
                      amount={selectedPlan.price}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}
              </div>

              {/* Benefits and Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-forest-green mb-6">Adoption Benefits</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-xl">
                      <span className="text-2xl">🌱</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Personal Connection</h3>
                        <p className="text-gray-600">Regular updates about your tree's growth and impact</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-xl">
                      <span className="text-2xl">📱</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Digital Certificate</h3>
                        <p className="text-gray-600">Receive a digital certificate of adoption</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-xl">
                      <span className="text-2xl">🌍</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Environmental Impact</h3>
                        <p className="text-gray-600">Track your contribution to environmental conservation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-xl">
                      <span className="text-2xl">🤝</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Community Access</h3>
                        <p className="text-gray-600">Join our community of tree adopters</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-forest-green/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-forest-green mb-4">About Your Tree</h3>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      {tree.description || `The ${tree.common_names.english || tree.scientific_name} is a remarkable tree species with significant ecological and cultural value.`}
                    </p>
                    {tree.uses.environmental && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Environmental Impact</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {tree.uses.environmental.map((impact, index) => (
                            <li key={index}>{impact}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdoptionPage; 