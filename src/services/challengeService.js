// Fixed challenge service with better error handling
import API, { validateToken, debugApiCall } from './api';

export const challengeService = {
  // Enhanced canJoinChallenge with better error handling and fallbacks
  async canJoinChallenge(id) {
    try {
      console.log('🔍 Starting joinability check for challenge:', id);
      
      // First validate the ID format
      if (!id || typeof id !== 'string' || id.length < 10) {
        console.error('❌ Invalid challenge ID format:', id);
        return {
          canJoin: false,
          reason: 'Invalid challenge ID',
          challenge: null,
          checks: { exists: false, validId: false }
        };
      }
      
      // Check network connectivity first
      if (!navigator.onLine) {
        console.error('❌ No internet connection');
        return {
          canJoin: false,
          reason: 'No internet connection. Please check your network.',
          challenge: null,
          checks: { exists: false, networkError: true }
        };
      }
      
      // Fetch challenge with retry mechanism
      let challenge;
      let fetchAttempts = 0;
      const maxAttempts = 2;
      
      while (fetchAttempts < maxAttempts) {
        try {
          fetchAttempts++;
          console.log(`📡 Fetch attempt ${fetchAttempts}/${maxAttempts} for challenge:`, id);
          
          challenge = await this.getChallenge(id);
          
          if (challenge && challenge._id) {
            console.log('✅ Challenge fetched successfully:', {
              id: challenge._id,
              title: challenge.title,
              status: challenge.status,
              attempt: fetchAttempts
            });
            break;
          } else {
            throw new Error('Invalid challenge data received');
          }
          
        } catch (fetchError) {
          console.error(`❌ Fetch attempt ${fetchAttempts} failed:`, {
            error: fetchError.message,
            status: fetchError.response?.status,
            isLastAttempt: fetchAttempts === maxAttempts
          });
          
          if (fetchAttempts === maxAttempts) {
            // Final attempt failed
            let reason = 'Challenge not found or unavailable';
            
            if (fetchError.message.includes('timeout')) {
              reason = 'Request timed out. Please try again.';
            } else if (fetchError.message.includes('Network error')) {
              reason = 'Network error. Please check your connection.';
            } else if (fetchError.response?.status === 404) {
              reason = 'Challenge not found';
            } else if (fetchError.response?.status === 401) {
              reason = 'Please log in to view this challenge';
            } else if (fetchError.response?.status === 403) {
              reason = 'Access denied to this challenge';
            }
            
            return {
              canJoin: false,
              reason: reason,
              challenge: null,
              checks: { exists: false, fetchError: fetchError.message },
              error: fetchError.message
            };
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Validate challenge object more thoroughly
      if (!challenge || !challenge._id) {
        console.error('❌ Invalid challenge object received:', challenge);
        return {
          canJoin: false,
          reason: 'Invalid challenge data',
          challenge: null,
          checks: { exists: false, invalidData: true }
        };
      }

      // Safe date parsing with multiple fallback strategies
      const now = new Date();
      let startDate, endDate;
      
      try {
        // Try parsing dates with multiple strategies
        if (challenge.startDate) {
          startDate = new Date(challenge.startDate);
          if (isNaN(startDate.getTime())) {
            // Try alternative parsing
            startDate = new Date(challenge.startDate.replace(/['"]/g, ''));
            if (isNaN(startDate.getTime())) {
              console.warn('⚠️ Could not parse start date:', challenge.startDate);
              startDate = null;
            }
          }
        }
        
        if (challenge.endDate) {
          endDate = new Date(challenge.endDate);
          if (isNaN(endDate.getTime())) {
            // Try alternative parsing
            endDate = new Date(challenge.endDate.replace(/['"]/g, ''));
            if (isNaN(endDate.getTime())) {
              console.warn('⚠️ Could not parse end date:', challenge.endDate);
              endDate = null;
            }
          }
        }
      } catch (dateError) {
        console.error('❌ Date parsing error:', dateError);
        startDate = null;
        endDate = null;
      }
      
      // More flexible date checks
      const checks = {
        exists: true,
        validId: true,
        isActive: challenge.status === 'active',
        hasStatus: !!challenge.status,
        hasStartDate: !!startDate,
        hasEndDate: !!endDate,
        hasStarted: startDate ? now >= startDate : true, // Assume started if no start date
        hasNotEnded: endDate ? now <= endDate : true,    // Assume not ended if no end date
        withinDateRange: true // Will be calculated below
      };
      
      // Calculate date range check more carefully
      if (startDate && endDate) {
        checks.withinDateRange = now >= startDate && now <= endDate;
      } else if (startDate && !endDate) {
        checks.withinDateRange = now >= startDate; // Only check start date
      } else if (!startDate && endDate) {
        checks.withinDateRange = now <= endDate; // Only check end date
      } else {
        checks.withinDateRange = true; // No date restrictions
      }
      
      // More lenient join conditions
      const canJoin = checks.exists && 
                     checks.validId &&
                     checks.isActive && 
                     checks.hasStarted && 
                     checks.hasNotEnded;
      
      // Enhanced debug logging
      console.log('🔍 Challenge joinability check details:', {
        challengeId: id,
        title: challenge.title,
        status: challenge.status,
        checks: checks,
        canJoin: canJoin,
        dates: {
          startDate: startDate ? startDate.toISOString() : 'Not set',
          endDate: endDate ? endDate.toISOString() : 'Not set',
          currentDate: now.toISOString(),
          startDateRaw: challenge.startDate,
          endDateRaw: challenge.endDate
        }
      });
      
      // Get specific reason why user can't join
      let reason = null;
      if (!checks.exists) {
        reason = 'Challenge not found';
      } else if (!checks.isActive) {
        reason = `Challenge is currently ${challenge.status || 'inactive'}`;
      } else if (!checks.hasStarted && startDate) {
        reason = `Challenge starts ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}`;
      } else if (!checks.hasNotEnded && endDate) {
        reason = `Challenge ended ${endDate.toLocaleDateString()} at ${endDate.toLocaleTimeString()}`;
      }
      
      return {
        canJoin,
        reason,
        challenge,
        checks
      };
      
    } catch (error) {
      console.error('💥 Unexpected error in canJoinChallenge:', {
        challengeId: id,
        errorType: error.constructor.name,
        errorMessage: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      
      return {
        canJoin: false,
        reason: `System error: ${error.message}. Please try again.`,
        challenge: null,
        checks: { systemError: true },
        error: error.message
      };
    }
  },

  // Enhanced join challenge with better error handling
  async joinChallenge(id) {
    try {
      // Input validation
      if (!id) {
        throw new Error('Challenge ID is required');
      }
      
      console.log('🎯 Starting join process for challenge:', id);
      
      // Token validation
      if (!validateToken()) {
        throw new Error('Authentication required - please log in');
      }
      
      // Pre-flight check
      console.log('🔍 Checking if challenge is joinable...');
      const joinabilityCheck = await this.canJoinChallenge(id);
      
      console.log('📊 Joinability check result:', {
        canJoin: joinabilityCheck.canJoin,
        reason: joinabilityCheck.reason,
        hasChallenge: !!joinabilityCheck.challenge,
        error: joinabilityCheck.error
      });
      
      if (!joinabilityCheck.canJoin) {
        const errorMsg = joinabilityCheck.reason || 'Challenge cannot be joined';
        console.warn('⚠️ Challenge join blocked:', errorMsg);
        throw new Error(errorMsg);
      }
      
      // Check if user already joined (optional check)
      try {
        const userStatus = await this.checkUserChallengeStatus(id);
        if (userStatus.alreadyJoined) {
          throw new Error('You have already joined this challenge');
        }
      } catch (statusError) {
        console.warn('⚠️ Could not verify user status, proceeding:', statusError.message);
      }
      
      console.log('🚀 Making join request...');
      
      // Make the actual join request
      const response = await API.post(`/challenges/${id}/join`);
      
      console.log('🎉 Successfully joined challenge:', {
        challengeId: id,
        responseData: response.data
      });
      
      return response.data;
      
    } catch (error) {
      console.error('💥 Join Challenge Error:', {
        challengeId: id,
        errorMessage: error.message,
        errorStatus: error.response?.status,
        errorData: error.response?.data,
        fullError: error
      });
      
      // Enhanced error message handling
      let userFriendlyMessage;
      
      if (error.response?.status) {
        userFriendlyMessage = this.getJoinErrorMessage(error);
      } else if (error.message) {
        userFriendlyMessage = error.message;
      } else {
        userFriendlyMessage = 'Failed to join challenge. Please try again.';
      }
      
      throw { 
        message: userFriendlyMessage,
        originalError: error.message,
        status: error.response?.status
      };
    }
  },

  // Enhanced getChallenge with better error handling and timeout
  async getChallenge(id) {
    try {
      if (!id) {
        throw new Error('Challenge ID is required');
      }
      
      console.log('📡 Fetching challenge details for ID:', id);
      
      // Add explicit timeout and retry logic
      const response = await Promise.race([
        API.get(`/challenges/${id}`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout after 15 seconds')), 15000)
        )
      ]);
      
      console.log('📡 Raw API response structure:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        hasDataProperty: !!response.data?.data,
        hasChallengeProperty: !!response.data?.data?.challenge,
        fullResponse: response.data
      });
      
      // Handle different response structures more robustly
      let challenge;
      if (response.data?.data?.challenge) {
        challenge = response.data.data.challenge;
      } else if (response.data?.challenge) {
        challenge = response.data.challenge;
      } else if (response.data?.data && typeof response.data.data === 'object') {
        challenge = response.data.data;
      } else if (response.data && response.data._id) {
        challenge = response.data;
      } else {
        console.error('❌ Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }
      
      // Validate essential challenge properties
      if (!challenge || !challenge._id) {
        console.error('❌ Challenge object missing required fields:', challenge);
        throw new Error('Invalid challenge data received');
      }
      
      console.log('📝 Challenge details loaded:', {
        id: challenge._id,
        title: challenge.title,
        status: challenge.status,
        category: challenge.category,
        difficulty: challenge.difficulty,
        points: challenge.points,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        participants: challenge.participants?.length || 0
      });
      
      return challenge;
    } catch (error) {
      console.error('💥 Error fetching challenge:', {
        challengeId: id,
        errorType: error.constructor.name,
        errorMessage: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        isNetworkError: !error.response,
        isTimeout: error.message.includes('timeout'),
        stack: error.stack
      });
      
      // More specific error handling
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your connection and try again.');
      } else if (!error.response) {
        throw new Error('Network error. Please check your internet connection.');
      } else if (error.response?.status === 404) {
        throw new Error('Challenge not found or has been removed');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required to view this challenge');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view this challenge');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch challenge details');
      }
    }
  },

  // Rest of the methods remain the same...
  async getChallenges(params = {}) {
    try {
      const response = await API.get('/challenges', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error.response?.data || { message: 'Failed to fetch challenges' };
    }
  },

  async getActiveChallenges(params = {}) {
    try {
      const allChallenges = await this.getChallenges(params);
      const now = new Date();
      
      const activeChallenges = allChallenges.filter(challenge => {
        const startDate = new Date(challenge.startDate);
        const endDate = new Date(challenge.endDate);
        
        return challenge.status === 'active' &&
               now >= startDate && 
               now <= endDate;
      });
      
      console.log('📊 Challenge Status Summary:', {
        total: allChallenges.length,
        active: activeChallenges.length,
        inactive: allChallenges.length - activeChallenges.length
      });
      
      return activeChallenges;
    } catch (error) {
      console.error('Error fetching active challenges:', error);
      throw error.response?.data || { message: 'Failed to fetch active challenges' };
    }
  },

  async checkUserChallengeStatus(challengeId) {
    try {
      const user = JSON.parse(localStorage.getItem('ecoquest_user') || '{}');
      
      console.log('🔍 Checking user challenge status:', {
        userId: user._id || 'unknown',
        challengeId: challengeId
      });
      
      const userChallenges = await API.get('/user/challenges');
      const joinedChallenge = userChallenges.data.data?.find(
        challenge => challenge._id === challengeId
      );
      
      return {
        alreadyJoined: !!joinedChallenge,
        challengeData: joinedChallenge
      };
      
    } catch (error) {
      console.warn('⚠️ Could not check user challenge status:', error.message);
      return { alreadyJoined: false, challengeData: null };
    }
  },

  getJoinErrorMessage(error) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    
    if (serverMessage) {
      return serverMessage;
    }
    
    switch (status) {
      case 400:
        return 'Unable to join challenge. You may have already joined or the challenge is no longer accepting participants.';
      case 401:
        return 'Please log in to join challenges.';
      case 403:
        return 'You do not have permission to join this challenge.';
      case 404:
        return 'Challenge not found. It may have been removed.';
      case 409:
        return 'You have already joined this challenge.';
      case 422:
        return 'Invalid request data.';
      default:
        return 'Failed to join challenge. Please try again later.';
    }
  },

  // Other methods remain the same...
  async getFeaturedChallenge() {
    try {
      const response = await API.get('/challenges/featured');
      console.log('🌟 Featured challenge loaded:', response.data.data.challenge?.title);
      return response.data.data.challenge;
    } catch (error) {
      console.error('Error fetching featured challenge:', error);
      throw error.response?.data || { message: 'Failed to fetch featured challenge' };
    }
  },

  async completeChallenge(id, submissionData) {
    try {
      if (!id) throw new Error('Challenge ID is required');
      if (!submissionData) throw new Error('Submission data is required');
      if (!validateToken()) throw new Error('Authentication required');
      
      console.log('🎯 Completing challenge:', { challengeId: id, submissionData });
      
      const response = await debugApiCall('post', `/challenges/${id}/complete`, submissionData);
      
      console.log('🎉 Challenge completed:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('💥 Complete Challenge Error:', {
        challengeId: id,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      let errorMessage = 'Failed to complete challenge';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request data';
      } else if (error.response?.status === 404) {
        errorMessage = 'Challenge not found';
      } else if (error.response?.status === 409) {
        errorMessage = 'Challenge already completed';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required';
      } else if (error.response?.status === 403) {
        errorMessage = 'Permission denied';
      }
      
      throw error.response?.data || { message: errorMessage };
    }
  },

  async getUserChallenges() {
    try {
      if (!validateToken()) throw new Error('Authentication required');
      
      const response = await API.get('/user/challenges');
      const challenges = response.data.data;
      
      console.log('👤 User challenges loaded:', {
        count: challenges?.length || 0
      });
      
      return challenges;
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      throw error.response?.data || { message: 'Failed to fetch user challenges' };
    }
  },

  async leaveChallenge(id) {
    try {
      if (!id) throw new Error('Challenge ID is required');
      if (!validateToken()) throw new Error('Authentication required');
      
      console.log('🚪 Leaving challenge:', id);
      
      const response = await API.delete(`/challenges/${id}/leave`);
      
      console.log('✅ Left challenge successfully');
      return response.data;
      
    } catch (error) {
      console.error('💥 Leave Challenge Error:', {
        challengeId: id,
        error: error.message,
        status: error.response?.status
      });
      
      let errorMessage = 'Failed to leave challenge';
      
      if (error.response?.status === 404) {
        errorMessage = 'Challenge not found or you are not a participant';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Cannot leave this challenge';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required';
      }
      
      throw error.response?.data || { message: errorMessage };
    }
  }
};