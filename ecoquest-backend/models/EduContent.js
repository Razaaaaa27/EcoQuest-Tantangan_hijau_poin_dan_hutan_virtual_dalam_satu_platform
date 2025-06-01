const mongoose = require('mongoose');

const eduContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Content description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  fullContent: {
    type: String,
    required: [true, 'Full content is required']
  },
  type: {
    type: String,
    required: true,
    enum: ['article', 'video', 'infographic']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Perubahan Iklim',
      'Konservasi Air', 
      'Energi Terbarukan',
      'Pengelolaan Sampah',
      'Pertanian Berkelanjutan',
      'Biodiversitas'
    ]
  },
  thumbnail: String,
  videoUrl: String, // For video content
  author: {
    name: {
      type: String,
      required: true
    },
    role: String,
    avatar: String,
    bio: String
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  readTime: Number, // in minutes
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual untuk like count
eduContentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual untuk comment count
eduContentSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Index untuk pencarian
eduContentSchema.index({ title: 'text', description: 'text', fullContent: 'text' });
eduContentSchema.index({ category: 1, type: 1, status: 1 });

module.exports = mongoose.model('EduContent', eduContentSchema);