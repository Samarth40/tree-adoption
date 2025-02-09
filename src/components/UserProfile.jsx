import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { imageUploadService } from '../services/firebaseServices';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    location: '',
    expertise: '',
    interests: [],
    socialLinks: {
      website: '',
      twitter: '',
      instagram: ''
    },
    avatarUrl: '',
    treesPlanted: 0,
    joinedDate: new Date().toISOString(),
    isProfileComplete: false
  });

  useEffect(() => {
    loadUserProfile();
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Ensure socialLinks object exists
        setProfileData({
          ...profileData,
          ...data,
          socialLinks: {
            website: '',
            twitter: '',
            instagram: '',
            ...(data.socialLinks || {})
          }
        });
      } else {
        // Initialize new user profile
        const newProfile = {
          ...profileData,
          email: currentUser.email,
          joinedDate: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setProfileData(newProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError('');
      const imageUrl = await imageUploadService.uploadImage(file, 'user_avatars');
      
      setProfileData(prev => ({
        ...prev,
        avatarUrl: imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updatedProfile = {
        ...profileData,
        email: currentUser.email,
        updatedAt: new Date().toISOString(),
        isProfileComplete: isProfileComplete(profileData)
      };
      
      // Use setDoc with merge option to update the document
      await setDoc(userDocRef, updatedProfile);
      
      // Only navigate if profile is complete
      if (isProfileComplete(updatedProfile)) {
        navigate('/dashboard');
      } else {
        setError('Please fill in all required fields to complete your profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const isProfileComplete = (profile) => {
    const requiredFields = {
      displayName: profile.displayName?.trim(),
      bio: profile.bio?.trim(),
      location: profile.location?.trim(),
      expertise: profile.expertise?.trim()
    };

    return Object.values(requiredFields).every(field => field && field.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-forest-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green/5 via-cream to-sage-green/10 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-forest-green mb-8">Complete Your Profile</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24">
                <img
                  src={profileData.avatarUrl || '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-forest-green text-white p-2 rounded-full cursor-pointer hover:bg-forest-green/90 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  📷
                </label>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{currentUser.email}</h2>
                <p className="text-gray-500">Joined {new Date(profileData.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    displayName: e.target.value
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    location: e.target.value
                  }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  bio: e.target.value
                }))}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                required
              />
            </div>

            {/* Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tree Care Expertise
              </label>
              <select
                value={profileData.expertise}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  expertise: e.target.value
                }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                required
              >
                <option value="">Select your expertise level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.socialLinks.website}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        website: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={profileData.socialLinks.twitter}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        twitter: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-forest-green text-white py-3 rounded-lg font-medium hover:bg-forest-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 