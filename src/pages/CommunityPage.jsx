import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  setDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  storiesService, 
  eventsService, 
  discussionsService, 
  imageUploadService,
  userProfileService,
  leaderboardService
} from '../services/firebaseServices';

// Add this helper function at the top of the file, after imports
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  // Handle Firestore Timestamp
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Handle regular Date objects or strings
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Handle string dates
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Mock data for community features
const communityEvents = [
  {
    id: 1,
    title: "Tree Planting Drive",
    date: "2024-04-15",
    location: "City Park",
    participants: 45,
    image: "https://images.unsplash.com/photo-1576085898323-218337e3e43c",
    description: "Join us for our monthly tree planting drive. Together, we'll plant native species and learn about their care."
  },
  {
    id: 2,
    title: "Workshop: Tree Care Basics",
    date: "2024-04-20",
    location: "Community Center",
    participants: 30,
    image: "https://images.unsplash.com/photo-1588449668365-d15e397f6787",
    description: "Learn essential tree care techniques from expert arborists. Perfect for beginners!"
  },
  {
    id: 3,
    title: "Sacred Trees Walk",
    date: "2024-04-25",
    location: "Heritage Garden",
    participants: 25,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    description: "Explore the cultural significance of sacred trees in our special guided tour."
  }
];

const communityStories = [
  {
    id: 1,
    user: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      location: "Mumbai"
    },
    tree: "Neem",
    impact: "150kg CO₂",
    story: "My journey with tree adoption started when I realized the importance of urban greenery. My neem tree has become a symbol of hope in our community.",
    images: ["https://images.unsplash.com/photo-1588449668365-d15e397f6787"],
    likes: 124,
    comments: 18
  },
  {
    id: 2,
    user: {
      name: "Rahul Verma",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      location: "Delhi"
    },
    tree: "Peepal",
    impact: "200kg CO₂",
    story: "Adopting a peepal tree has connected me with our cultural heritage. It's amazing to see how one tree can make such a difference.",
    images: ["https://images.unsplash.com/photo-1610847499832-918a1c3c6813"],
    likes: 89,
    comments: 12
  }
];

const discussionTopics = [
  {
    id: 1,
    title: "Best practices for watering young trees",
    author: "Tree Care Expert",
    replies: 23,
    views: 156,
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    title: "Identifying common tree diseases",
    author: "Plant Pathologist",
    replies: 45,
    views: 289,
    lastActive: "1 day ago"
  },
  {
    id: 3,
    title: "Traditional uses of sacred trees",
    author: "Cultural Researcher",
    replies: 67,
    views: 432,
    lastActive: "3 hours ago"
  }
];

const impactLeaders = [
  {
    rank: 1,
    name: "Priya Sharma",
    trees: 12,
    impact: "600kg CO₂",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    rank: 2,
    name: "Rahul Verma",
    trees: 10,
    impact: "500kg CO₂",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    rank: 3,
    name: "Amit Patel",
    trees: 8,
    impact: "400kg CO₂",
    avatar: "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c"
  }
];

const CommunityPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stories, setStories] = useState([]);
  const [events, setEvents] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [impactLeaders, setImpactLeaders] = useState([]);
  const [activeTab, setActiveTab] = useState('stories');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State for new content
  const [newStory, setNewStory] = useState({ 
    title: '', 
    content: '', 
    image: null
  });
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    location: '', 
    maxParticipants: 50 
  });
  const [newDiscussion, setNewDiscussion] = useState({ 
    title: '', 
    content: '', 
    tags: [] 
  });

  // Loading and error states
  const [submitting, setSubmitting] = useState(false);

  // Add these new states
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [activeStory, setActiveStory] = useState(null);
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [expandedDiscussions, setExpandedDiscussions] = useState({});
  const [newReply, setNewReply] = useState('');
  const [loadingReplies, setLoadingReplies] = useState({});
  const [replies, setReplies] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!currentUser) {
          console.log("No authenticated user found");
          navigate('/login');
          return;
        }

        // Check user profile
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          console.log("No user profile found, creating one");
          // Create user profile if it doesn't exist
          const newProfile = {
            email: currentUser.email,
            displayName: currentUser.displayName || '',
            avatarUrl: currentUser.photoURL || '',
            treesPlanted: 0,
            impact: 0,
            isProfileComplete: false,
            isAdmin: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);
          setIsAdmin(false);
          navigate('/profile');
          return;
        }

        const userData = userDoc.data();
        setUserProfile(userData);
        setIsAdmin(userData.isAdmin || false);

        if (!userData.isProfileComplete) {
          console.log("Profile incomplete, redirecting to profile page");
          navigate('/profile');
          return;
        }

        // Load community data
        const [storiesData, eventsData, discussionsData, leaderboardData] = await Promise.all([
          storiesService.getStories(),
          eventsService.getUpcomingEvents(),
          discussionsService.getTopics(),
          leaderboardService.getTopUsers(5) // Get top 5 users
        ]);

        setStories(storiesData);
        setEvents(eventsData);
        setDiscussions(discussionsData);
        setImpactLeaders(leaderboardData);

      } catch (err) {
        console.error('Error initializing community page:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [currentUser, navigate]);

  // Add useEffect for error toast
  useEffect(() => {
    if (globalError) {
      setShowErrorToast(true);
      const timer = setTimeout(() => {
        setShowErrorToast(false);
        setGlobalError(null);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [globalError]);

  const handleImageUpload = async (file) => {
    try {
      const imageUrl = await imageUploadService.uploadImage(
        file,
        `community/${currentUser.uid}`
      );
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG or PNG).');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB. Please choose a smaller image.');
      return;
    }

    // Clear any existing errors
    setError('');

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setNewStory(prev => ({ ...prev, image: file }));

    // Clean up the preview URL when component unmounts
    return () => URL.revokeObjectURL(previewUrl);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setNewStory(prev => ({ ...prev, image: null }));
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    if (!newStory.title.trim() || !newStory.content.trim()) {
      setError('Please fill in both the title and content fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let imageUrl = '';
      if (newStory.image) {
        try {
          imageUrl = await imageUploadService.uploadImage(newStory.image, 'community');
        } catch (imageError) {
          setSubmitting(false);
          setError(imageError.message);
          return;
        }
      }

      await storiesService.addStory({
        title: newStory.title,
        content: newStory.content,
        imageUrl,
        userId: currentUser.uid,
        userDisplayName: userProfile.displayName,
        userAvatar: userProfile.avatarUrl
      });

      // Reset form and close modal only on success
      setNewStory({ title: '', content: '', image: null });
      setImagePreview(null);
      setError('');
      setShowCreateModal(false);
      
      // Refresh stories
      const updatedStories = await storiesService.getStories();
      setStories(updatedStories);
    } catch (error) {
      console.error('Error submitting story:', error);
      setError(
        error.code === 'permission-denied'
          ? 'You do not have permission to create stories. Please check your account status.'
          : error.code === 'unavailable'
          ? 'Network error. Please check your internet connection and try again.'
          : 'Failed to submit story. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile.isProfileComplete) {
      navigate('/profile');
      return;
    }

    if (!isAdmin) {
      setError('Only administrators can create events');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await eventsService.addEvent({
        ...newEvent,
        userId: currentUser.uid,
        userDisplayName: userProfile.displayName
      });

      setNewEvent({ 
        title: '', 
        description: '', 
        date: '', 
        location: '', 
        maxParticipants: 50 
      });
      setShowCreateModal(false);
      await loadCommunityData();
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscussionSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile.isProfileComplete) {
      navigate('/profile');
      return;
    }

    try {
      setSubmitting(true);
      await discussionsService.addTopic({
        ...newDiscussion,
        userId: currentUser.uid,
        userDisplayName: userProfile.displayName,
        userAvatar: userProfile.avatarUrl
      });

      setNewDiscussion({ title: '', content: '', tags: [] });
      await loadCommunityData();
    } catch (error) {
      console.error('Error creating discussion:', error);
      setError('Failed to create discussion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeStory = async (storyId) => {
    try {
      const isLiked = await storiesService.likeStory(storyId, currentUser.uid);
      const updatedStories = stories.map(story => {
        if (story.id === storyId) {
          return {
            ...story,
            likes: story.likes + (isLiked ? 1 : -1),
            likedBy: isLiked 
              ? [...story.likedBy, currentUser.uid]
              : story.likedBy.filter(id => id !== currentUser.uid)
          };
        }
        return story;
      });
      setStories(updatedStories);
    } catch (error) {
      console.error('Error liking story:', error);
      setError('Failed to like story');
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const hasJoined = await eventsService.joinEvent(eventId, currentUser.uid);
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            participantCount: event.participantCount + (hasJoined ? 1 : -1),
            participants: hasJoined
              ? [...event.participants, currentUser.uid]
              : event.participants.filter(id => id !== currentUser.uid)
          };
        }
        return event;
      });
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error joining event:', error);
      setError('Failed to join event');
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      setSubmitting(true);
      await storiesService.deleteStory(storyId);
      setStories(prev => prev.filter(story => story.id !== storyId));
    } catch (error) {
      console.error('Error deleting story:', error);
      setError('Failed to delete story');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDiscussion = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;

    try {
      setSubmitting(true);
      await discussionsService.deleteTopic(topicId);
      setDiscussions(prev => prev.filter(topic => topic.id !== topicId));
    } catch (error) {
      console.error('Error deleting discussion:', error);
      setError('Failed to delete discussion');
    } finally {
      setSubmitting(false);
    }
  };

  const loadCommunityData = async () => {
    try {
      const loadDataWithRetry = async (serviceFn, retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            return await serviceFn();
          } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
          }
        }
      };

      console.log('Loading community data...');
      const [storiesData, eventsData, discussionsData] = await Promise.all([
        loadDataWithRetry(() => storiesService.getStories()),
        loadDataWithRetry(() => eventsService.getUpcomingEvents()),
        loadDataWithRetry(() => discussionsService.getTopics())
      ]);

      console.log('Events data received:', eventsData);
      setStories(storiesData);
      setEvents(eventsData);
      setDiscussions(discussionsData);
    } catch (error) {
      console.error('Error loading community data:', error);
      setError('Failed to load community data');
    }
  };

  const handleLoadComments = async (storyId) => {
    try {
      setLoadingComments(prev => ({ ...prev, [storyId]: true }));
      const response = await storiesService.getComments(storyId);
      setComments(prev => ({ ...prev, [storyId]: response.comments }));
      
      // Update the story's comment count in the UI
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, commentCount: response.totalComments }
          : story
      ));
      
      setExpandedComments(prev => ({ ...prev, [storyId]: true }));
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoadingComments(prev => ({ ...prev, [storyId]: false }));
    }
  };

  const handleAddComment = async (storyId) => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = {
        content: newComment,
        userId: currentUser.uid,
        userDisplayName: userProfile.displayName,
        userAvatar: userProfile.avatarUrl,
      };

      const response = await storiesService.addComment(storyId, comment);
      
      // Update comments list
      setComments(prev => ({
        ...prev,
        [storyId]: [response, ...(prev[storyId] || [])]
      }));
      
      // Update story comment count in the UI
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, commentCount: response.storyCommentCount }
          : story
      ));

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setSubmitting(true);
      await eventsService.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadReplies = async (topicId) => {
    try {
      setLoadingReplies(prev => ({ ...prev, [topicId]: true }));
      const repliesData = await discussionsService.getReplies(topicId);
      setReplies(prev => ({ ...prev, [topicId]: repliesData }));
      setExpandedDiscussions(prev => ({ ...prev, [topicId]: true }));
    } catch (error) {
      console.error('Error loading replies:', error);
      setError('Failed to load replies');
    } finally {
      setLoadingReplies(prev => ({ ...prev, [topicId]: false }));
    }
  };

  const handleAddReply = async (topicId) => {
    if (!newReply.trim()) return;

    try {
      setSubmitting(true);
      const reply = {
        content: newReply,
        userId: currentUser.uid,
        userDisplayName: userProfile.displayName,
        userAvatar: userProfile.avatarUrl,
        createdAt: new Date()
      };

      await discussionsService.addReply(topicId, reply);
      
      // Refresh replies
      const updatedReplies = await discussionsService.getReplies(topicId);
      setReplies(prev => ({ ...prev, [topicId]: updatedReplies }));
      
      // Update discussion reply count
      setDiscussions(prev => prev.map(topic => 
        topic.id === topicId 
          ? { ...topic, replies: (topic.replies || 0) + 1 }
          : topic
      ));

      setNewReply('');
    } catch (error) {
      console.error('Error adding reply:', error);
      setError('Failed to add reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (storyId, commentId) => {
    try {
      const isLiked = await storiesService.likeComment(storyId, commentId, currentUser.uid);
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: {
          count: (prev[commentId]?.count || 0) + (isLiked ? 1 : -1),
          isLiked
        }
      }));
    } catch (error) {
      console.error('Error liking comment:', error);
      setError('Failed to like comment');
    }
  };

  const handleDeleteComment = async (storyId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setSubmitting(true);
      const newCommentCount = await storiesService.deleteComment(storyId, commentId);
      
      // Remove the comment from the UI
      setComments(prev => ({
        ...prev,
        [storyId]: prev[storyId].filter(comment => comment.id !== commentId)
      }));
      
      // Update the story's comment count
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, commentCount: newCommentCount }
          : story
      ));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-forest-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-forest-green text-lg">Loading community...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Community</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-forest-green text-white py-3 rounded-lg hover:bg-forest-green/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-green/10 to-cream/20">
      {/* Error Toast */}
      <AnimatePresence>
        {showErrorToast && globalError && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg px-6 py-4 max-w-md mx-auto">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{globalError}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setShowErrorToast(false)}
                    className="text-red-400 hover:text-red-500 focus:outline-none"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main container with proper navbar spacing */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-forest-green mb-4">Tree Adoption Community</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Connect, share, and grow with fellow tree adopters in our vibrant community.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-md">
            {['stories', 'events', 'discussions'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-leaf-green text-white shadow-sm'
                    : 'text-gray-600 hover:text-forest-green hover:bg-sage-green/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'stories' && (
                  <div className="space-y-6">
                    {stories.map((story) => (
                      <div key={story.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <img 
                                src={story.userAvatar || story.user?.avatar || '/default-avatar.png'} 
                                alt={story.userDisplayName || story.user?.name} 
                                className="w-12 h-12 rounded-full object-cover" 
                              />
                              <div className="ml-4">
                                <h3 className="font-semibold text-gray-800">
                                  {story.userDisplayName || story.user?.name}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <span>{story.location || story.user?.location || 'Unknown location'}</span>
                                  <span className="mx-2">•</span>
                                  <span>{formatTimestamp(story.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            {(story.userId === currentUser?.uid || isAdmin) && (
              <button 
                                onClick={() => handleDeleteStory(story.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
              </button>
                            )}
                          </div>
                          {(story.imageUrl || (story.images && story.images.length > 0)) && (
                            <div className="relative mb-4 rounded-xl overflow-hidden">
                              <div className="aspect-w-16 aspect-h-9">
                                <img 
                                  src={story.imageUrl || story.images?.[0]} 
                                  alt="Story" 
                                  className="w-full h-full object-contain bg-gray-50"
                                  style={{
                                    maxHeight: '500px',
                                    width: '100%',
                                    objectFit: 'contain'
                                  }}
                                  onClick={(e) => {
                                    e.target.classList.toggle('object-contain');
                                    e.target.classList.toggle('object-cover');
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          <p className="text-gray-700 mb-4">{story.content || story.story}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <span className="mr-2">🌳</span>
                                {story.tree || 'Tree'}
                              </span>
                              <span className="flex items-center">
                                <span className="mr-2">🌱</span>
                                {story.impact || '0kg CO₂'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
              <button 
                                onClick={() => handleLikeStory(story.id)}
                                className="flex items-center text-gray-500 hover:text-leaf-green transition-colors"
                              >
                                <span className="mr-1">❤️</span>
                                {story.likes || 0}
              </button>
                              <button className="flex items-center text-gray-500 hover:text-leaf-green transition-colors">
                                <span className="mr-1">💭</span>
                                {story.comments || 0}
                              </button>
                            </div>
                          </div>
                          
                          {/* Comments Section */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={() => {
                                  if (!expandedComments[story.id]) {
                                    handleLoadComments(story.id);
                                  }
                                  setExpandedComments(prev => ({
                                    ...prev,
                                    [story.id]: !prev[story.id]
                                  }));
                                  setShowCommentInput(prev => ({
                                    ...prev,
                                    [story.id]: !prev[story.id]
                                  }));
                                }}
                                className="flex items-center text-sm text-gray-500 hover:text-forest-green transition-colors"
                              >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {story.commentCount || 0} Comments
                              </button>
              </div>

                            {expandedComments[story.id] && (
                              <div className="space-y-4">
                                {loadingComments[story.id] ? (
                                  <div className="flex justify-center py-4">
                                    <div className="w-6 h-6 border-2 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                ) : (
                                  <>
                                    {/* Comment Input */}
                                    <div className="flex items-start space-x-3 mb-6">
                                      <img
                                        src={userProfile?.avatarUrl || '/default-avatar.png'}
                                        alt={userProfile?.displayName}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                      <div className="flex-1">
                                        <div className="relative bg-gray-50 rounded-2xl">
                                          <textarea
                                            value={activeStory === story.id ? newComment : ''}
                                            onChange={(e) => {
                                              setActiveStory(story.id);
                                              setNewComment(e.target.value);
                                            }}
                                            placeholder="Write a comment..."
                                            rows={1}
                                            className="w-full px-4 py-3 bg-transparent text-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-leaf-green focus:border-leaf-green resize-none"
                                          />
                                          <button
                                            onClick={() => handleAddComment(story.id)}
                                            disabled={!newComment.trim() || submitting}
                                            className="absolute right-3 top-2.5 text-forest-green hover:text-leaf-green disabled:text-gray-300 transition-colors"
                                          >
                                            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                          </button>
            </div>
          </div>
        </div>

                                    {/* Comments List */}
                                    <div className="space-y-4">
                                      {comments[story.id]?.map((comment) => (
                                        <div key={comment.id} className="group">
                                          <div className="flex space-x-3">
                                            <img
                                              src={comment.userAvatar || '/default-avatar.png'}
                                              alt={comment.userDisplayName}
                                              className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                              <div className="bg-gray-50 rounded-2xl px-4 py-2">
                                                <div className="flex items-center justify-between">
                                                  <p className="font-medium text-sm text-gray-900">{comment.userDisplayName}</p>
                                                  <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500">
                                                      {formatTimestamp(comment.createdAt)}
                                                    </span>
                                                    {(comment.userId === currentUser?.uid || isAdmin) && (
                <button
                                                        onClick={() => handleDeleteComment(story.id, comment.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                </button>
                                                    )}
              </div>
            </div>
                                                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                              </div>
                                              <div className="flex items-center space-x-4 mt-1 ml-4">
                                                <button
                                                  onClick={() => handleLikeComment(story.id, comment.id)}
                                                  className={`flex items-center text-sm ${
                                                    commentLikes[comment.id]?.isLiked
                                                      ? 'text-red-500'
                                                      : 'text-gray-500 hover:text-red-500'
                                                  } transition-colors`}
                                                >
                                                  <svg className="w-4 h-4 mr-1" fill={commentLikes[comment.id]?.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                  </svg>
                                                  {commentLikes[comment.id]?.count || 0}
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    setActiveStory(story.id);
                                                    setNewComment(`@${comment.userDisplayName} `);
                                                  }}
                                                  className="text-sm text-gray-500 hover:text-forest-green transition-colors"
                                                >
                                                  Reply
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-6">
                    {events.map((event) => (
                      <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="aspect-w-16 aspect-h-9">
                          <img src={event.image || "https://images.unsplash.com/photo-1576085898323-218337e3e43c"} alt={event.title} className="w-full h-48 object-cover" />
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                              <p className="text-sm text-gray-500">
                                Organized by {event.userDisplayName || 'Anonymous'}
                              </p>
                            </div>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">{event.description}</p>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-gray-500">
                              <span className="mr-2">📅</span>
                              {formatTimestamp(event.date)}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <span className="mr-2">📍</span>
                              {event.location}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              <span>{event.participants?.length || 0}</span>
                              <span className="mx-1">/</span>
                              <span>{event.maxParticipants}</span>
                              <span className="ml-1">participants</span>
                            </div>
                            <button
                              onClick={() => handleJoinEvent(event.id)}
                              disabled={
                                submitting || 
                                (event.participants?.length >= event.maxParticipants && 
                                !event.participants?.includes(currentUser?.uid))
                              }
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                event.participants?.includes(currentUser?.uid)
                                  ? 'bg-forest-green text-white hover:bg-red-500'
                                  : 'bg-leaf-green text-white hover:bg-forest-green'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {submitting 
                                ? 'Processing...' 
                                : event.participants?.includes(currentUser?.uid)
                                  ? 'Leave Event'
                                  : event.participants?.length >= event.maxParticipants
                                    ? 'Event Full'
                                    : 'Join Event'
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'discussions' && (
                  <div className="space-y-4">
                    {discussions.map((topic) => (
                      <div key={topic.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <img
                                src={topic.userAvatar || '/default-avatar.png'}
                                alt={topic.userDisplayName}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">{topic.title}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <span>Started by {topic.userDisplayName}</span>
                                  <span className="mx-2">•</span>
                                  <span>{formatTimestamp(topic.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2">{topic.content}</p>
                            {topic.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {topic.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-sage-green/10 text-forest-green rounded-lg text-sm"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteDiscussion(topic.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-6">
                              <span className="flex items-center">
                                <span className="mr-2">💬</span>
                                {topic.replies || 0} replies
                              </span>
                              <span className="flex items-center">
                                <span className="mr-2">👁️</span>
                                {topic.views || 0} views
                              </span>
                            </div>
                            <button
                              onClick={() => !expandedDiscussions[topic.id] && handleLoadReplies(topic.id)}
                              className="text-forest-green hover:text-leaf-green transition-colors"
                            >
                              {expandedDiscussions[topic.id] ? 'Hide Replies' : 'Show Replies'}
                            </button>
                          </div>

                          {expandedDiscussions[topic.id] && (
                            <div className="mt-4 space-y-4">
                              {loadingReplies[topic.id] ? (
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 border-2 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                <>
                                  {replies[topic.id]?.map((reply) => (
                                    <div key={reply.id} className="flex space-x-3">
                                      <img
                                        src={reply.userAvatar || '/default-avatar.png'}
                                        alt={reply.userDisplayName}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                      <div className="flex-1">
                                        <div className="bg-gray-50 rounded-2xl px-4 py-2">
                                          <p className="font-medium text-sm text-gray-900">{reply.userDisplayName}</p>
                                          <p className="text-sm text-gray-700">{reply.content}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 ml-4">
                                          {formatTimestamp(reply.createdAt)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}

                                  {/* Add Reply Form */}
                                  <div className="flex items-start space-x-3 mt-4">
                                    <img
                                      src={userProfile?.avatarUrl || '/default-avatar.png'}
                                      alt={userProfile?.displayName}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="relative">
                                        <textarea
                                          value={newReply}
                                          onChange={(e) => setNewReply(e.target.value)}
                                          placeholder="Add a reply..."
                                          rows={1}
                                          className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-leaf-green focus:border-leaf-green resize-none"
                                        />
                                        <button
                                          onClick={() => handleAddReply(topic.id)}
                                          disabled={!newReply.trim() || submitting}
                                          className="absolute right-2 top-2 text-forest-green hover:text-leaf-green disabled:text-gray-300 transition-colors"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Create New Content Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className={`w-full bg-gradient-to-r from-leaf-green to-forest-green text-white rounded-xl py-3 px-4 font-medium shadow-md hover:shadow-lg transition-all duration-300 ${
                (activeTab !== 'stories' && !isAdmin) ? 'hidden' : ''
              }`}
            >
              Create New {activeTab.slice(0, -1)}
            </button>

            {/* Impact Leaders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Impact Leaders</h3>
              <div className="space-y-4">
                {impactLeaders.length > 0 ? (
                  impactLeaders.map((leader, index) => (
                    <div key={leader.id} className="flex items-center">
                      <span className="w-6 text-lg font-semibold text-leaf-green">#{index + 1}</span>
                      <img 
                        src={leader.avatarUrl || '/default-avatar.png'} 
                        alt={leader.displayName} 
                        className="w-10 h-10 rounded-full object-cover mx-3" 
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{leader.displayName || 'Anonymous'}</h4>
                        <p className="text-sm text-gray-500">
                          {leader.treesPlanted || 0} trees · {leader.impact || 0}kg CO₂
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>No impact leaders yet</p>
                    <p className="text-sm mt-2">Be the first to make an impact!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Create New {activeTab.slice(0, -1)}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {activeTab === 'stories' && (
                  <form onSubmit={handleStorySubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                          <div className="ml-auto pl-3">
                            <button
                              type="button"
                              onClick={() => setError('')}
                              className="text-red-400 hover:text-red-500 focus:outline-none"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newStory.title}
                        onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                        placeholder="Give your story a title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={newStory.content}
                        onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                        placeholder="Share your tree planting experience..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image <span className="text-sm text-gray-500">(Must contain clear images of trees or plants)</span>
                      </label>
                      {imagePreview ? (
                        <div className="relative rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-red-50"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-leaf-green transition-colors"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                          />
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500">Click to upload an image of trees or plants</p>
                          <p className="text-sm text-gray-400 mt-1">The image must clearly show trees or plants</p>
                          <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      {error && error.includes('image') && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-leaf-green text-white rounded-lg hover:bg-forest-green transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Creating...' : 'Create Story'}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'events' && (
                  <form onSubmit={handleEventSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Title
                      </label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                        placeholder="Name your event"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                        placeholder="Describe your event..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                          placeholder="Event location"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Participants
                      </label>
                      <input
                        type="number"
                        value={newEvent.maxParticipants}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                        min="1"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-leaf-green text-white rounded-lg hover:bg-forest-green transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Creating...' : 'Create Event'}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'discussions' && (
                  <form onSubmit={handleDiscussionSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic Title
                      </label>
                      <input
                        type="text"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                        placeholder="What would you like to discuss?"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                        placeholder="Share your thoughts..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={newDiscussion.tags.join(', ')}
                        onChange={(e) => setNewDiscussion(prev => ({ 
                          ...prev, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-leaf-green focus:border-leaf-green"
                        placeholder="Add tags separated by commas"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-leaf-green text-white rounded-lg hover:bg-forest-green transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Creating...' : 'Start Discussion'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage; 