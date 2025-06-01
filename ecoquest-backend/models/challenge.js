const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Challenge description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['recycle', 'plantation', 'conservation', 'water', 'energy', 'education', 'community']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  points: {
    type: Number,
    required: true,
    min: [10, 'Minimum points is 10'],
    max: [500, 'Maximum points is 500']
  },
  requirements: [{
    type: String,
    required: true
  }],
  instructions: [{
    step: Number,
    description: String
  }],
  image: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'active'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    status: {
      type: String,
      enum: ['joined', 'in-progress', 'completed', 'failed'],
      default: 'joined'
    },
    submissionData: {
      text: String,
      images: [String],
      location: {
        latitude: Number,
        longitude: Number,
        address: String
      }
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual untuk participant count - FIXED
challengeSchema.virtual('participantCount').get(function() {
  return (this.participants && Array.isArray(this.participants)) ? this.participants.length : 0;
});

// Virtual untuk completion rate - FIXED
challengeSchema.virtual('completionRate').get(function() {
  if (!this.participants || !Array.isArray(this.participants) || this.participants.length === 0) {
    return 0;
  }
  
  const completedCount = this.participants.filter(p => p && p.status === 'completed').length;
  return Math.round((completedCount / this.participants.length) * 100);
});

// Virtual untuk submission count (jika diperlukan)
challengeSchema.virtual('submissionCount').get(function() {
  if (!this.participants || !Array.isArray(this.participants)) {
    return 0;
  }
  
  return this.participants.filter(p => p && p.submissionData && p.submissionData.text).length;
});

// Index untuk pencarian dan filter
challengeSchema.index({ category: 1, difficulty: 1, status: 1 });
challengeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Challenge', challengeSchema);