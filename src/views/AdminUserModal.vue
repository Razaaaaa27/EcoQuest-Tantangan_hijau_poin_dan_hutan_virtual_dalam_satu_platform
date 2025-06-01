<!-- AdminUserModal.vue - Modal for editing users -->
<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit User' : 'User Details' }}</h3>
        <button @click="$emit('close')" class="btn-close">×</button>
      </div>
      <div class="modal-body">
        <div class="user-info">
          <div class="user-avatar-section">
            <img :src="user.avatar" :alt="user.username" class="user-avatar-large" />
            <div class="user-basic-info">
              <h4>{{ user.username }}</h4>
              <p>{{ user.email }}</p>
              <span class="role-badge" :class="user.role">{{ user.role }}</span>
            </div>
          </div>
          
          <div class="user-stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ user.gameStats?.level || 1 }}</span>
              <span class="stat-label">Level</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ user.gameStats?.totalPoints || 0 }}</span>
              <span class="stat-label">Points</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ user.statistics?.challengesCompleted || 0 }}</span>
              <span class="stat-label">Challenges</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ user.statistics?.treesPlanted || 0 }}</span>
              <span class="stat-label">Trees</span>
            </div>
          </div>

          <div class="user-details">
            <div class="detail-row">
              <span class="detail-label">Full Name:</span>
              <span class="detail-value">{{ user.profile?.fullName || 'Not provided' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Bio:</span>
              <span class="detail-value">{{ user.profile?.bio || 'Not provided' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">{{ user.profile?.location || 'Not provided' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Joined:</span>
              <span class="detail-value">{{ formatDate(user.createdAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Last Active:</span>
              <span class="detail-value">{{ formatDate(user.updatedAt) }}</span>
            </div>
          </div>

          <div class="role-management" v-if="canEditRole">
            <h5>Role Management</h5>
            <div class="form-group">
              <label>User Role:</label>
              <select v-model="selectedRole" @change="updateRole">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn btn-secondary">Close</button>
        <button v-if="canDelete" @click="deleteUser" class="btn btn-danger">
          Delete User
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUserModal',
  props: {
    user: {
      type: Object,
      required: true
    },
    canEditRole: {
      type: Boolean,
      default: true
    },
    canDelete: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedRole: this.user.role,
      isEditing: false
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    async updateRole() {
      if (this.selectedRole !== this.user.role) {
        this.$emit('update-role', {
          userId: this.user._id,
          newRole: this.selectedRole
        })
      }
    },
    deleteUser() {
      if (confirm(`Are you sure you want to delete ${this.user.username}?`)) {
        this.$emit('delete-user', this.user._id)
      }
    }
  }
}
</script>