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
      const storiesRef = collection(db, 'stories');
      const story = {
        ...storyData,
        createdAt: serverTimestamp(),
        likes: 0,
        commentCount: 0,
        likedBy: []
      };
      const docRef = await addDoc(storiesRef, story);
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
      
      // Get the comments count for each story
      const stories = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const storyData = doc.data();
          const commentsRef = collection(db, 'stories', doc.id, 'comments');
          const commentsSnapshot = await getDocs(commentsRef);
          const commentCount = commentsSnapshot.size;
          
          // Update the story's comment count if it's different
          if (storyData.commentCount !== commentCount) {
            await updateDoc(doc.ref, { commentCount });
          }

          return {
            id: doc.id,
            ...storyData,
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
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef,
        orderBy('date', 'asc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Raw event data:', data);
        
        // Handle date conversion safely
        let convertedDate = null;
        if (data.date && typeof data.date.toDate === 'function') {
          convertedDate = data.date.toDate();
        } else if (data.date instanceof Date) {
          convertedDate = data.date;
        } else if (typeof data.date === 'string') {
          convertedDate = new Date(data.date);
        }
        
        return {
          id: doc.id,
          ...data,
          date: convertedDate
        };
      });
      console.log('Processed events:', events);
      
      // Filter out events with invalid dates and sort by date
      const validEvents = events
        .filter(event => event.date instanceof Date && !isNaN(event.date))
        .sort((a, b) => a.date - b.date);
      
      return validEvents;
    } catch (error) {
      console.error('Error getting upcoming events:', error);
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
      // Create a blob URL from the file
      const imageUrl = URL.createObjectURL(file);

      // Create an image element and wait for it to load
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image. Please try a different image file.'));
        img.src = imageUrl;
      });

      // Basic image validation
      if (img.width < 200 || img.height < 200) {
        throw new Error('Image is too small. Please upload an image that is at least 200x200 pixels.');
      }

      if (img.width > 4096 || img.height > 4096) {
        throw new Error('Image is too large. Please upload an image that is no larger than 4096x4096 pixels.');
      }

      // Clean up
      URL.revokeObjectURL(imageUrl);
      return true;

    } catch (error) {
      console.error('Image verification error:', error);
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

      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'treeadopt_unsigned');
      formData.append('folder', folder);

      // Upload to Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dherd7qxm/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 
          'Failed to upload image. Please try again.'
        );
      }

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error('Failed to get image URL. Please try uploading again.');
      }

      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async deleteImage(imageUrl) {
    try {
      // Extract public ID from the URL
      const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
      
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('upload_preset', 'treeadopt_unsigned');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dherd7qxm/image/destroy',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
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