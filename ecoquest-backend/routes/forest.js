const express = require('express');
const Forest = require('../models/Forest');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @route   GET /api/forest
 * @desc    Get user's forest
 * @access  Private
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  let forest = await Forest.findOne({ user: req.user.id });

  if (!forest) {
    // Create initial forest if doesn't exist
    forest = await Forest.create({
      user: req.user.id,
      trees: [],
      forestStats: {
        achievements: [
          { name: 'Penemu Hutan', description: 'Tanam pohon pertamamu', achieved: false },
          { name: 'Kebun Mini', description: 'Tanam 5 pohon', achieved: false },
          { name: 'Tukang Kebun', description: 'Tanam 10 pohon', achieved: false },
          { name: 'Kolektor Pohon', description: 'Tanam setiap jenis pohon', achieved: false },
          { name: 'Penghijauan', description: 'Tanam 25 pohon', achieved: false }
        ]
      }
    });
  }

  res.status(200).json({
    status: 'success',
    data: { forest }
  });
}));

/**
 * @route   POST /api/forest/plant
 * @desc    Plant a new tree
 * @access  Private
 */
router.post('/plant', authenticate, asyncHandler(async (req, res) => {
  const { type, label, description, challenge, challengeName } = req.body;

  if (!['pine', 'oak', 'maple'].includes(type)) {
    return res.status(400).json({
      status: 'error',
      message: 'Jenis pohon tidak valid'
    });
  }

  let forest = await Forest.findOne({ user: req.user.id });

  if (!forest) {
    forest = await Forest.create({ user: req.user.id, trees: [] });
  }

  const newTree = {
    id: Date.now().toString(),
    type,
    plantedDate: new Date(),
    challenge: challenge || null,
    challengeName: challengeName || 'Inisiatif Pribadi',
    label: label || '',
    description: description || '',
    coordinates: {
      x: Math.random() * 100,
      y: Math.random() * 100
    }
  };

  forest.trees.push(newTree);

  // Update achievements
  const achievements = forest.forestStats.achievements;
  
  // Penemu Hutan - first tree
  if (forest.trees.length === 1) {
    const achievement = achievements.find(a => a.name === 'Penemu Hutan');
    if (achievement && !achievement.achieved) {
      achievement.achieved = true;
      achievement.achievedAt = new Date();
    }
  }

  // Kebun Mini - 5 trees
  if (forest.trees.length === 5) {
    const achievement = achievements.find(a => a.name === 'Kebun Mini');
    if (achievement && !achievement.achieved) {
      achievement.achieved = true;
      achievement.achievedAt = new Date();
    }
  }

  // Tukang Kebun - 10 trees
  if (forest.trees.length === 10) {
    const achievement = achievements.find(a => a.name === 'Tukang Kebun');
    if (achievement && !achievement.achieved) {
      achievement.achieved = true;
      achievement.achievedAt = new Date();
    }
  }

  // Kolektor Pohon - all tree types
  const treeTypes = [...new Set(forest.trees.map(t => t.type))];
  if (treeTypes.length === 3) {
    const achievement = achievements.find(a => a.name === 'Kolektor Pohon');
    if (achievement && !achievement.achieved) {
      achievement.achieved = true;
      achievement.achievedAt = new Date();
    }
  }

  // Penghijauan - 25 trees
  if (forest.trees.length === 25) {
    const achievement = achievements.find(a => a.name === 'Penghijauan');
    if (achievement && !achievement.achieved) {
      achievement.achieved = true;
      achievement.achievedAt = new Date();
    }
  }

  await forest.save();

  // Update user stats
  const user = await User.findById(req.user.id);
  user.gameStats.totalPoints += 50; // Points for planting a tree
  user.statistics.treesPlanted += 1;
  await user.save();

  res.status(201).json({
    status: 'success',
    message: 'Pohon berhasil ditanam!',
    data: {
      tree: newTree,
      pointsEarned: 50,
      newAchievements: achievements.filter(a => a.achieved && !a.achievedAt || 
        (a.achievedAt && new Date() - new Date(a.achievedAt) < 1000))
    }
  });
}));

module.exports = router;