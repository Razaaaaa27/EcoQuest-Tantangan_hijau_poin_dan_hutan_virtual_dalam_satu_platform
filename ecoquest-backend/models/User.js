const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${this.username}&background=random`;
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    fullName: String,
    bio: String,
    location: String,
    website: String,
    joinDate: {
      type: Date,
      default: Date.now
    }
  },
  gameStats: {
    level: {
      type: Number,
      default: 1
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    rank: {
      type: Number,
      default: 0
    },
    badges: [{
      name: String,
      earnedAt: Date,
      description: String
    }]
  },
  statistics: {
    challengesCompleted: {
      type: Number,
      default: 0
    },
    treesPlanted: {
      type: Number,
      default: 0
    },
    wasteRecycled: {
      type: Number,
      default: 0
    },
    waterSaved: {
      type: Number,
      default: 0
    },
    carbonOffset: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      showRealName: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual untuk next level progress
userSchema.virtual('nextLevelProgress').get(function() {
  const pointsForCurrentLevel = this.gameStats.level * 250;
  const pointsInCurrentLevel = this.gameStats.totalPoints % 250;
  return Math.round((pointsInCurrentLevel / 250) * 100);
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update level based on points
userSchema.pre('save', function(next) {
  if (this.isModified('gameStats.totalPoints')) {
    this.gameStats.level = Math.floor(this.gameStats.totalPoints / 250) + 1;
  }
  next();
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
