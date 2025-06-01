const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: [true, 'Submission title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Submission description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    url: String,
    originalName: String,
    size: Number,
    mimetype: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
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
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  }
}, {
  timestamps: true
});

// Index untuk performance
submissionSchema.index({ challenge: 1, user: 1 });
submissionSchema.index({ status: 1, submittedAt: -1 });
submissionSchema.index({ 'adminReview.reviewedAt': -1 });

module.exports = mongoose.model('Submission', submissionSchema);