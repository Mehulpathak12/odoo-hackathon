const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../../utils/cloudinary'); // path to your cloudinary config
const User = require('../../models/User.model'); // adjust path to User model
const {body,validationResult } = require('express-validator');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper: send JWT as cookie
function sendTokenCookie(res, user) {
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role }, 
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

// Auth middleware to protect routes
function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// @route   POST /api/auth/signup
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password, location, photoUrl } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'Name, email and password are required' });
//     }
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ success: false, message: 'Email already in use' });
//     }
//     const hash = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       passwordHash: hash,
//       location: location || '',
//       photoUrl: photoUrl || ''
//     });
//     sendTokenCookie(res, user);
//     res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// })
router.post(
  '/auth/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('location').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        
      const { name, email, password, location} = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        passwordHash: hash,
        location: location || ''
      });

      sendTokenCookie(res, user);
      res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    sendTokenCookie(res, user);
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
router.post('/auth/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @route   PUT /api/auth/profile/photo
router.put('/auth/profile/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { photoUrl: result.secure_url },
      { new: true }
    );
    res.json({ success: true, photoUrl: user.photoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// @route   PUT /api/auth/profile/skills
router.put('/auth/profile/skills', authMiddleware, async (req, res) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skillsOffered: skillsOffered || [], skillsWanted: skillsWanted || [] },
      { new: true }
    );
    res.json({ success: true, skillsOffered: user.skillsOffered, skillsWanted: user.skillsWanted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// @route   PUT /api/auth/profile
router.put('/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { name, location, availability, isPublic } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (location !== undefined) updates.location = location;
    if (availability) updates.availability = availability;
    if (isPublic !== undefined) updates.isPublic = isPublic;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({
      success: true,
      profile: {
        name: user.name,
        location: user.location,
        skillsOffered: user.skillsOffered.length ? user.skillsOffered : ['No skills offered, please add.'],
        skillsWanted: user.skillsWanted.length ? user.skillsWanted : ['No skills wanted, please add.'],
        availability: user.availability,
        isPublic: user.isPublic,
        photoUrl: user.photoUrl,
        profileUrl: `/users/${user._id}`
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// @route   GET /api/auth/profile
router.get('/auth/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({
      success: true,
      profile: {
        name: user.name,
        location: user.location,
        skillsOffered: user.skillsOffered.length ? user.skillsOffered : ['No skills offered, please add.'],
        skillsWanted: user.skillsWanted.length ? user.skillsWanted : ['No skills wanted, please add.'],
        availability: user.availability,
        isPublic: user.isPublic,
        photoUrl: user.photoUrl,
        profileUrl: `/users/${user._id}`
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fetch failed' });
  }
});

module.exports = router;