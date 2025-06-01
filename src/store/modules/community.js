// src/store/modules/community.js
import { communityService } from '@/services/communityService'

export default {
  namespaced: true,
  state: () => ({
    members: [],
    posts: [], // Tambah state untuk posts
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    }
  }),
  
  mutations: {
    // Existing mutations
    setMembers(state, members) {
      state.members = members;
    },
    addMember(state, member) {
      state.members.push(member);
    },
    
    // New mutations for posts
    setPosts(state, posts) {
      state.posts = posts || [];
    },
    addPost(state, post) {
      if (post) {
        state.posts.unshift(post); // Add to beginning
      }
    },
    updatePost(state, updatedPost) {
      if (updatedPost && updatedPost.id) {
        const index = state.posts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
          state.posts.splice(index, 1, updatedPost);
        }
      }
    },
    removePost(state, postId) {
      state.posts = state.posts.filter(p => p.id !== postId);
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    setPagination(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination };
    }
  },
  
  actions: {
    // Existing action
    async fetchCommunityMembers({ commit }) {
      try {
        const dummyMembers = [
          { id: 1, name: 'Ayu' },
          { id: 2, name: 'Budi' },
        ];
        commit('setMembers', dummyMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
        commit('setError', error.message || 'Failed to fetch members');
      }
    },

    // New actions for posts
    async fetchPosts({ commit }, params = {}) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        const response = await communityService.getPosts(params);
        
        // Handle different response structures
        let posts = [];
        let pagination = {};
        
        if (response && typeof response === 'object') {
          // If response has posts property
          if (response.posts) {
            posts = Array.isArray(response.posts) ? response.posts : [];
          }
          // If response has data property
          else if (response.data) {
            posts = Array.isArray(response.data) ? response.data : [];
          }
          // If response is direct array
          else if (Array.isArray(response)) {
            posts = response;
          }
          
          // Handle pagination
          if (response.pagination) {
            pagination = response.pagination;
          }
        }
        
        commit('setPosts', posts);
        commit('setPagination', pagination);
        
        return { posts, pagination };
        
      } catch (error) {
        console.error('Error fetching posts:', error);
        const errorMessage = error.message || 'Failed to fetch posts';
        commit('setError', errorMessage);
        commit('setPosts', []); // Set empty array on error
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async createPost({ commit, dispatch }, postData) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        const response = await communityService.createPost(postData);
        
        // Handle different response structures
        let newPost = null;
        if (response && typeof response === 'object') {
          if (response.post) {
            newPost = response.post;
          } else if (response.data && response.data.post) {
            newPost = response.data.post;
          } else if (response.data) {
            newPost = response.data;
          } else {
            newPost = response;
          }
        }
        
        if (newPost) {
          commit('addPost', newPost);
        }
        
        return response;
        
      } catch (error) {
        console.error('Error creating post:', error);
        const errorMessage = error.message || 'Failed to create post';
        commit('setError', errorMessage);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async updatePost({ commit }, { id, postData }) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        const response = await communityService.updatePost(id, postData);
        
        let updatedPost = null;
        if (response && typeof response === 'object') {
          if (response.post) {
            updatedPost = response.post;
          } else if (response.data && response.data.post) {
            updatedPost = response.data.post;
          } else if (response.data) {
            updatedPost = response.data;
          }
        }
        
        if (updatedPost) {
          commit('updatePost', updatedPost);
        }
        
        return response;
        
      } catch (error) {
        console.error('Error updating post:', error);
        const errorMessage = error.message || 'Failed to update post';
        commit('setError', errorMessage);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async deletePost({ commit }, postId) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        const response = await communityService.deletePost(postId);
        commit('removePost', postId);
        return response;
        
      } catch (error) {
        console.error('Error deleting post:', error);
        const errorMessage = error.message || 'Failed to delete post';
        commit('setError', errorMessage);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async toggleLike({ dispatch }, postId) {
      try {
        const response = await communityService.toggleLike(postId);
        // Refresh posts to get updated like status
        await dispatch('fetchPosts');
        return response;
        
      } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
      }
    },

    async addComment({ dispatch }, { postId, text }) {
      try {
        const response = await communityService.addComment(postId, text);
        // Refresh posts to get updated comments
        await dispatch('fetchPosts');
        return response;
        
      } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
      }
    }
  },
  
  getters: {
    // Existing getters
    memberCount(state) {
      return state.members.length;
    },
    allMembers(state) {
      return state.members;
    },
    
    // New getters for posts
    allPosts(state) {
      return state.posts || [];
    },
    postsCount(state) {
      return state.posts ? state.posts.length : 0;
    },
    isLoading(state) {
      return state.loading;
    },
    getError(state) {
      return state.error;
    },
    getPagination(state) {
      return state.pagination;
    },
    getPostById: (state) => (id) => {
      return state.posts.find(post => post.id === id);
    }
  }
};