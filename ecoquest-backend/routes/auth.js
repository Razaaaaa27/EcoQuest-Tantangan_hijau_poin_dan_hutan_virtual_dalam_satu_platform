const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Forest = require('../models/forest');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register user baru
 * @access  Public
 */
router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: existingUser.email === email 
        ? 'Email sudah terdaftar' 
        : 'Username sudah digunakan'
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    profile: {
      fullName: fullName || username
    }
  });

  // Create initial forest for user
  await Forest.create({
    user: user._id,
    trees: [],
    forestStats: {
      achievements: [
        {
          name: 'Penemu Hutan',
          description: 'Tanam pohon pertamamu',
          achieved: false
        },
        {
          name: 'Kebun Mini', 
          description: 'Tanam 5 pohon',
          achieved: false
        },
        {
          name: 'Tukang Kebun',
          description: 'Tanam 10 pohon', 
          achieved: false
        },
        {
          name: 'Kolektor Pohon',
          description: 'Tanam setiap jenis pohon',
          achieved: false
        },
        {
          name: 'Penghijauan',
          description: 'Tanam 25 pohon',
          achieved: false
        }
      ]
    }
  });

  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    message: 'Registrasi berhasil! Selamat datang di EcoQuest!',
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        gameStats: user.gameStats,
        statistics: user.statistics
      }
    }
  });
}));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      status: 'error',
      message: 'Email atau password tidak valid'
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Login berhasil!',
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        gameStats: user.gameStats,
        statistics: user.statistics,
        profile: user.profile
      }
    }
  });
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logout berhasil!'
  });
}));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        gameStats: user.gameStats,
        statistics: user.statistics,
        profile: user.profile,
        preferences: user.preferences
      }
    }
  });
}));

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
  const {
    fullName,
    bio,
    location,
    website,
    avatar,
    preferences
  } = req.body;

  const updateData = {};

  if (fullName !== undefined) updateData['profile.fullName'] = fullName;
  if (bio !== undefined) updateData['profile.bio'] = bio;
  if (location !== undefined) updateData['profile.location'] = location;
  if (website !== undefined) updateData['profile.website'] = website;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (preferences !== undefined) updateData.preferences = preferences;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Profile berhasil diperbarui',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        gameStats: user.gameStats,
        statistics: user.statistics,
        profile: user.profile,
        preferences: user.preferences
      }
    }
  });
}));

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Password lama dan password baru wajib diisi'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      status: 'error',
      message: 'Password baru minimal 6 karakter'
    });
  }

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({
      status: 'error',
      message: 'Password lama tidak benar'
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password berhasil diubah'
  });
}));

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticate, asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      status: 'error',
      message: 'Password diperlukan untuk menghapus akun'
    });
  }

  const user = await User.findById(req.user.id).select('+password');

  // Verify password
  if (!(await user.matchPassword(password))) {
    return res.status(400).json({
      status: 'error',
      message: 'Password tidak benar'
    });
  }

  // Delete related data
  await Forest.findOneAndDelete({ user: req.user.id });
  
  // Delete user
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    status: 'success',
    message: 'Akun berhasil dihapus'
  });
}));

module.exports = router;