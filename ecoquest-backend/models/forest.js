const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ['pine', 'oak', 'maple'],
    required: true
  },
  plantedDate: {
    type: Date,
    default: Date.now
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  challengeName: String,
  label: String,
  description: String,
  coordinates: {
    x: Number,
    y: Number
  }
});

const forestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  trees: [treeSchema],
  forestStats: {
    totalTrees: {
      type: Number,
      default: 0
    },
    carbonOffset: {
      type: Number,
      default: 0
    },
    forestLevel: {
      type: Number,
      default: 1
    },
    achievements: [{
      name: String,
      description: String,
      achieved: Boolean,
      achievedAt: Date
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update stats setiap kali trees berubah
forestSchema.pre('save', function(next) {
  if (this.isModified('trees')) {
    this.forestStats.totalTrees = this.trees.length;
    this.forestStats.carbonOffset = this.trees.length * 21; // kg CO2/year per tree
    this.forestStats.forestLevel = Math.floor(this.trees.length / 5) + 1;
  }
  next();
});

// module.exports = mongoose.model('Forest', forestSchema);
module.exports = mongoose.models.Forest || mongoose.model('Forest', forestSchema);