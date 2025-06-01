const mongoose = require('mongoose');

const challengeSubmissionSchema = new mongoose.Schema({
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionText: {
    type: String,
    required: [true, 'Submission text is required'],
    maxlength: [1000, 'Submission text cannot exceed 1000 characters']
  },
  submissionImages: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminReview: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    comment: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceInfo: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index untuk query optimization
challengeSubmissionSchema.index({ challenge: 1, user: 1 });
challengeSubmissionSchema.index({ status: 1, submittedAt: -1 });
challengeSubmissionSchema.index({ user: 1, submittedAt: -1 });

// Virtual untuk submission age
challengeSubmissionSchema.virtual('submissionAge').get(function() {
  return Date.now() - this.submittedAt.getTime();
});

// Virtual untuk image count
challengeSubmissionSchema.virtual('imageCount').get(function() {
  return this.submissionImages.length;
});

module.exports = mongoose.model('ChallengeSubmission', challengeSubmissionSchema);