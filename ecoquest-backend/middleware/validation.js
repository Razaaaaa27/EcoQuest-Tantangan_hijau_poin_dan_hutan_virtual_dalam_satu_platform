const { body, validationResult } = require('express-validator');

// Middleware untuk menangani validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Data tidak valid',
      errors: errors.array()
    });
  }
  next();
};

// Validasi untuk registrasi user
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username harus 3-30 karakter')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username hanya boleh mengandung huruf, angka, dan underscore'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email tidak valid'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password harus mengandung huruf kecil, huruf besar, dan angka'),
  
  handleValidationErrors
];

// Validasi untuk login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email tidak valid'),
  
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi'),
  
  handleValidationErrors
];

// Validasi untuk membuat challenge
const validateChallenge = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Judul challenge harus 5-100 karakter'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Deskripsi challenge harus 20-1000 karakter'),
  
  body('category')
    .isIn(['recycle', 'plantation', 'conservation', 'water', 'energy', 'education', 'community'])
    .withMessage('Kategori tidak valid'),
  
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Tingkat kesulitan tidak valid'),
  
  body('points')
    .isInt({ min: 10, max: 500 })
    .withMessage('Poin harus antara 10-500'),
  
  body('requirements')
    .isArray({ min: 1 })
    .withMessage('Minimal 1 requirement diperlukan'),
  
  handleValidationErrors
];

// Validasi untuk post komunitas
const validatePost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Konten post harus 1-2000 karakter'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'friends', 'private'])
    .withMessage('Visibility tidak valid'),
  
  handleValidationErrors
];

// Validasi untuk komentar
const validateComment = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Komentar harus 1-500 karakter'),
  
  handleValidationErrors
];

// Validasi untuk konten edukasi
const validateEduContent = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Judul harus 5-200 karakter'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage('Deskripsi harus 20-500 karakter'),
  
  body('fullContent')
    .trim()
    .isLength({ min: 100 })
    .withMessage('Konten lengkap minimal 100 karakter'),
  
  body('type')
    .isIn(['article', 'video', 'infographic'])
    .withMessage('Tipe konten tidak valid'),
  
  body('category')
    .isIn([
      'Perubahan Iklim',
      'Konservasi Air', 
      'Energi Terbarukan',
      'Pengelolaan Sampah',
      'Pertanian Berkelanjutan',
      'Biodiversitas'
    ])
    .withMessage('Kategori tidak valid'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateChallenge,
  validatePost,
  validateComment,
  validateEduContent
};