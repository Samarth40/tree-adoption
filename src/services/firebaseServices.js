import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  where,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { pipeline } from '@xenova/transformers';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// Stories Service
export const storiesService = {
  // Add a new story
  async addStory(storyData) {
    try {
      console.log('Adding story with data:', {
        userId: storyData.userId,
        userDisplayName: storyData.userDisplayName,
        userAvatar: storyData.userAvatar
      });

      // Validate and ensure user data is present
      if (!storyData.userId) {
        throw new Error('User ID is required');
      }

      // Get user profile data if not provided
      if (!storyData.userDisplayName || !storyData.userAvatar) {
        console.log('Fetching user profile data for userId:', storyData.userId);
        const userRef = doc(db, 'users', storyData.userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data fetched:', {
            displayName: userData.displayName,
            avatarUrl: userData.avatarUrl
          });
          
          // Clean up avatar URL if it exists
          let avatarUrl = userData.avatarUrl;
          if (avatarUrl && typeof avatarUrl === 'string') {
            avatarUrl = avatarUrl.replace(/^["'](.+)["']$/, '$1');
          }
          
          storyData.userDisplayName = userData.displayName || 'Anonymous';
          storyData.userAvatar = avatarUrl || '/default-avatar.png';
        } else {
          console.log('User document not found, using defaults');
          storyData.userDisplayName = 'Anonymous';
          storyData.userAvatar = '/default-avatar.png';
        }
      } else {
        // Clean up provided avatar URL
        if (storyData.userAvatar && typeof storyData.userAvatar === 'string') {
          storyData.userAvatar = storyData.userAvatar.replace(/^["'](.+)["']$/, '$1');
        }
      }

      console.log('Final story data for submission:', {
        userDisplayName: storyData.userDisplayName,
        userAvatar: storyData.userAvatar
      });

      const storiesRef = collection(db, 'stories');
      const story = {
        ...storyData,
        createdAt: serverTimestamp(),
        likes: 0,
        commentCount: 0,
        likedBy: [],
        // Ensure these fields are always present and clean
        userDisplayName: storyData.userDisplayName || 'Anonymous',
        userAvatar: storyData.userAvatar || '/default-avatar.png'
      };
      const docRef = await addDoc(storiesRef, story);
      console.log('Story added successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding story:', error);
      throw error;
    }
  },

  // Get stories with pagination
  async getStories(limitCount = 20) {
    try {
      const storiesRef = collection(db, 'stories');
      const q = query(
        storiesRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      // Get the comments count and user data for each story
      const stories = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const storyData = doc.data();
          
          // Get comments count
          const commentsRef = collection(db, 'stories', doc.id, 'comments');
          const commentsSnapshot = await getDocs(commentsRef);
          const commentCount = commentsSnapshot.size;
          
          // Update the story's comment count if it's different
          if (storyData.commentCount !== commentCount) {
            await updateDoc(doc.ref, { commentCount });
          }

          // Get user profile data if not already included
          let userData = {};
          if (storyData.userId && (!storyData.userDisplayName || !storyData.userAvatar)) {
            const userRef = doc(db, 'users', storyData.userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              userData = {
                userDisplayName: userDoc.data().displayName || 'Anonymous',
                userAvatar: userDoc.data().avatarUrl || '/default-avatar.png'
              };
            }
          }

          return {
            id: doc.id,
            ...storyData,
            ...userData,
            commentCount
          };
        })
      );

      return stories;
    } catch (error) {
      console.error('Error getting stories:', error);
      throw error;
    }
  },

  // Like a story
  async likeStory(storyId, userId) {
    try {
      const storyRef = doc(db, 'stories', storyId);
      const storyDoc = await getDoc(storyRef);
      
      if (storyDoc.data().likedBy.includes(userId)) {
        await updateDoc(storyRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
        return false; // Unliked
      } else {
        await updateDoc(storyRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
        return true; // Liked
      }
    } catch (error) {
      console.error('Error toggling story like:', error);
      throw error;
    }
  },

  // Get comments for a story
  async getComments(storyId) {
    try {
      const commentsRef = collection(db, 'stories', storyId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      // Get the current story's comment count
      const storyRef = doc(db, 'stories', storyId);
      const storyDoc = await getDoc(storyRef);
      const totalComments = storyDoc.data()?.commentCount || querySnapshot.size;

      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      // Return both comments and total count
      return {
        comments,
        totalComments
      };
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  // Add a comment to a story
  async addComment(storyId, comment) {
    try {
      // First, create the comment in the subcollection
      const commentsRef = collection(db, 'stories', storyId, 'comments');
      const commentData = {
        ...comment,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: []
      };
      const commentDoc = await addDoc(commentsRef, commentData);

      // Get the current comment count
      const storyRef = doc(db, 'stories', storyId);
      const storyDoc = await getDoc(storyRef);
      const currentCount = storyDoc.data().commentCount || 0;

      // Update the story's comment count
      await updateDoc(storyRef, {
        commentCount: (currentCount + 1)
      });

      // Return the new comment with the updated count
      return {
        id: commentDoc.id,
        ...commentData,
        createdAt: new Date(),
        storyCommentCount: currentCount + 1 // Include the new total count
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Like a comment
  async likeComment(storyId, commentId, userId) {
    try {
      const commentRef = doc(db, 'stories', storyId, 'comments', commentId);
      const commentDoc = await getDoc(commentRef);
      
      if (!commentDoc.exists()) {
        throw new Error('Comment not found');
      }

      const likedBy = commentDoc.data().likedBy || [];
      const isLiked = likedBy.includes(userId);

      await updateDoc(commentRef, {
        likes: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
      });

      return !isLiked; // Return true if liked, false if unliked
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  },

  // Delete a story
  async deleteStory(storyId) {
    try {
      const storyRef = doc(db, 'stories', storyId);
      await deleteDoc(storyRef);
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  },

  // Delete a comment
  async deleteComment(storyId, commentId) {
    try {
      // Get the story reference
      const storyRef = doc(db, 'stories', storyId);
      const storyDoc = await getDoc(storyRef);
      const currentCount = storyDoc.data().commentCount || 0;

      // Delete the comment
      const commentRef = doc(db, 'stories', storyId, 'comments', commentId);
      await deleteDoc(commentRef);

      // Update the story's comment count
      await updateDoc(storyRef, {
        commentCount: Math.max(0, currentCount - 1)
      });

      return currentCount - 1; // Return the new comment count
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

// Events Service
export const eventsService = {
  // Add a new event
  async addEvent(eventData) {
    try {
      console.log('Adding event with data:', eventData);
      const eventsRef = collection(db, 'events');
      
      // Ensure date is converted to Timestamp
      let eventDate;
      try {
        eventDate = eventData.date instanceof Date 
          ? Timestamp.fromDate(eventData.date)
          : Timestamp.fromDate(new Date(eventData.date));
      } catch (error) {
        console.error('Error converting date:', error);
        throw new Error('Invalid date format');
      }

      const event = {
        ...eventData,
        date: eventDate,
        createdAt: serverTimestamp(),
        participantCount: 0,
        participants: [],
        status: 'upcoming'
      };
      console.log('Processed event data:', event);
      const docRef = await addDoc(eventsRef, event);
      return docRef.id;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  },

  // Get upcoming events
  async getUpcomingEvents(limitCount = 10) {
    try {
      console.log('Starting getUpcomingEvents with limit:', limitCount);
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef,
        orderBy('date', 'asc'),
        limit(limitCount)
      );
      console.log('Executing Firestore query for events...');
      const querySnapshot = await getDocs(q);
      console.log('Retrieved events count:', querySnapshot.size);
      
      const events = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Processing event document:', {
          id: doc.id,
          rawData: {
            title: data.title,
            date: data.date,
            status: data.status,
            participantCount: data.participantCount,
            maxParticipants: data.maxParticipants
          }
        });
        
        // Handle date conversion safely
        let convertedDate = null;
        if (data.date && typeof data.date.toDate === 'function') {
          convertedDate = data.date.toDate();
          console.log('Converted Timestamp to Date:', convertedDate);
        } else if (data.date instanceof Date) {
          convertedDate = data.date;
          console.log('Date already in correct format:', convertedDate);
        } else if (typeof data.date === 'string') {
          convertedDate = new Date(data.date);
          console.log('Converted string to Date:', convertedDate);
        } else {
          console.log('Unable to convert date, using null. Original value:', data.date);
        }
        
        const processedEvent = {
          id: doc.id,
          ...data,
          date: convertedDate
        };
        
        console.log('Processed event:', {
          id: processedEvent.id,
          title: processedEvent.title,
          date: processedEvent.date,
          status: processedEvent.status,
          participantCount: processedEvent.participantCount
        });
        
        return processedEvent;
      });
      
      // Filter out events with invalid dates and sort by date
      const validEvents = events
        .filter(event => {
          const isValid = event.date instanceof Date && !isNaN(event.date);
          if (!isValid) {
            console.log('Filtering out event with invalid date:', {
              id: event.id,
              title: event.title,
              date: event.date
            });
          }
          return isValid;
        })
        .sort((a, b) => a.date - b.date);
      
      console.log('Final processed events count:', validEvents.length);
      console.log('Final events data:', validEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        status: event.status,
        participantCount: event.participantCount
      })));
      
      return validEvents;
    } catch (error) {
      console.error('Error in getUpcomingEvents:', error);
      throw error;
    }
  },

  // Delete an event
  async deleteEvent(eventId) {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Join an event
  async joinEvent(eventId, userId) {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventDoc.data();
      if (eventData.participants?.includes(userId)) {
        await updateDoc(eventRef, {
          participantCount: increment(-1),
          participants: arrayRemove(userId)
        });
        return false; // Left event
      } else {
        if (eventData.participantCount >= eventData.maxParticipants) {
          throw new Error('Event is full');
        }
        await updateDoc(eventRef, {
          participantCount: increment(1),
          participants: arrayUnion(userId)
        });
        return true; // Joined event
      }
    } catch (error) {
      console.error('Error toggling event participation:', error);
      throw error;
    }
  },

  async updateEventStatus(eventId, status) {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, { status });
    } catch (error) {
      console.error('Error updating event status:', error);
      throw error;
    }
  }
};

// Discussions Service
export const discussionsService = {
  // Add a new topic
  async addTopic(topicData) {
    try {
      const topicsRef = collection(db, 'discussions');
      const topic = {
        ...topicData,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        replyCount: 0,
        views: 0,
        tags: topicData.tags || []
      };
      const docRef = await addDoc(topicsRef, topic);
      return docRef.id;
    } catch (error) {
      console.error('Error adding topic:', error);
      throw error;
    }
  },

  // Delete a topic and its replies
  async deleteTopic(topicId) {
    try {
      // First, delete all replies in the subcollection
      const repliesRef = collection(db, 'discussions', topicId, 'replies');
      const repliesSnapshot = await getDocs(repliesRef);
      const deletePromises = repliesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Then delete the topic document
      const topicRef = doc(db, 'discussions', topicId);
      await deleteDoc(topicRef);
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  },

  // Get discussion topics
  async getTopics(limitCount = 20) {
    try {
      const topicsRef = collection(db, 'discussions');
      const q = query(
        topicsRef,
        orderBy('lastActive', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting topics:', error);
      throw error;
    }
  },

  // Add reply to a topic
  async addReply(topicId, replyData) {
    try {
      const repliesRef = collection(db, 'discussions', topicId, 'replies');
      await addDoc(repliesRef, {
        ...replyData,
        createdAt: serverTimestamp()
      });

      const topicRef = doc(db, 'discussions', topicId);
      await updateDoc(topicRef, {
        replyCount: increment(1),
        lastActive: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  },

  async getReplies(topicId, limitCount = 50) {
    try {
      const repliesRef = collection(db, 'discussions', topicId, 'replies');
      const q = query(
        repliesRef,
        orderBy('createdAt', 'asc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting replies:', error);
      throw error;
    }
  },

  async incrementViews(topicId) {
    try {
      const topicRef = doc(db, 'discussions', topicId);
      await updateDoc(topicRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }
};

// Image Upload Service
export const imageUploadService = {
  async verifyTreeImage(file) {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file (JPG or PNG).');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB. Please choose a smaller image.');
      }

      return true;
    } catch (error) {
      console.error('Error verifying image:', error);
      throw error;
    }
  },

  async uploadImage(file, folder = 'general') {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file (JPG or PNG).');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB. Please choose a smaller image.');
      }

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      // Use our backend API endpoint with relative path
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: base64Data,
          resource_type: 'image',
          folder: folder
        }),
        credentials: 'same-origin',
        mode: 'same-origin'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 
          'Failed to upload image. Please try again.'
        );
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error('Failed to get image URL. Please try uploading again.');
      }

      return data.url;
    } catch (error) {
      console.error('Error uploading image:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });

      let errorMessage = 'Failed to upload image.';
      
      if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        errorMessage = 'Upload was blocked. Please disable any ad blockers or security extensions and try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to upload service. Please check your internet connection and try again.';
      }
      
      throw new Error(errorMessage);
    }
  },

  async deleteImage(imageUrl) {
    try {
      if (!imageUrl) {
        throw new Error('Image URL is required for deletion');
      }

      // Extract public ID from the URL
      const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
      
      // Use our backend API endpoint with relative path
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          resource_type: 'image'
        }),
        credentials: 'same-origin',
        mode: 'same-origin'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting image:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      let errorMessage = 'Failed to delete image.';
      
      if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        errorMessage = 'Delete request was blocked. Please disable any ad blockers or security extensions and try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to delete service. Please check your internet connection and try again.';
      }
      
      throw new Error(errorMessage);
    }
  }
};

// Leaderboard Service
export const leaderboardService = {
  // Get top users
  async getTopUsers(limitCount = 10) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('impact', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting top users:', error);
      throw error;
    }
  },

  // Update user impact
  async updateUserImpact(userId, impactData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        impact: increment(impactData.impact),
        treesAdopted: increment(impactData.trees || 0)
      });
    } catch (error) {
      console.error('Error updating user impact:', error);
      throw error;
    }
  }
};

// User Profile Service
export const userProfileService = {
  async updateProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async getProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return null;
      }
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async incrementTreeCount(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        treesPlanted: increment(1),
        impact: increment(50) // Assuming each tree has an impact value of 50
      });
    } catch (error) {
      console.error('Error incrementing tree count:', error);
      throw error;
    }
  }
};