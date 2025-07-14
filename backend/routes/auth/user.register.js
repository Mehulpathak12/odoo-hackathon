const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../../utils/cloudinary'); // path to your cloudinary config
const User = require('../../models/User.model'); // adjust path to User model
const SwapRequest = require('../../models/SwapRequest.model');
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
    console.log("server running");
    
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
        location: location || '',
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
router.get('/auth/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // 1. Calculate rating
    const ratingValues = user.ratings?.map(r => r.score) || [];
    const averageRating = ratingValues.length
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
      : "NaN";

    // 2. Calculate total successful swaps
    const totalSwaps = await SwapRequest.countDocuments({
      status: 'accepted',
      $or: [
        { requester: user._id },
        { target: user._id }
      ]
    });

    // 3. Respond with profile + totalSwaps
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
        ratings: averageRating,
        totalSwaps: totalSwaps,
        profileUrl: `/api/users/${user._id}`
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fetch failed' });
  }
});

router.put('/auth/profile', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      location,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic,
      photoUrl
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (location !== undefined) user.location = location;
    if (Array.isArray(skillsOffered)) user.skillsOffered = skillsOffered.map(s => s.trim()).filter(Boolean);
    if (Array.isArray(skillsWanted)) user.skillsWanted = skillsWanted.map(s => s.trim()).filter(Boolean);
    if (Array.isArray(availability)) user.availability = availability.map(s => s.trim()).filter(Boolean);
    if (isPublic !== undefined) user.isPublic = isPublic;
    if (photoUrl !== undefined) user.photoUrl = photoUrl;

    await user.save();

    const ratingValues = user.ratings?.map(r => r.score) || [];
    const averageRating = ratingValues.length
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
      : "NaN";

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
        ratings: averageRating,
        profileUrl: `/api/users/${user._id}`,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

router.get('/users/public', async (req, res) => {
  try {
    let currentUserId = null;

    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.id;
      } catch (err) {
        console.warn('Invalid token in cookie');
      }
    }

    const query = { isPublic: true };
    if (currentUserId) query._id = { $ne: currentUserId };

    const users = await User.find(query).select(
      'name location skillsOffered skillsWanted availability photoUrl _id ratings'
    );

    const formatted = users.map(user => {
      const ratingValues = user.ratings?.map(r => r.score) || [];
      const averageRating = ratingValues.length
        ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
        : "NaN";

      return {
        id: user._id,
        name: user.name,
        location: user.location || 'Not specified',
        photoUrl: user.photoUrl || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png',
        skillsOffered: user.skillsOffered.length ? user.skillsOffered : ['No skills offered'],
        skillsWanted: user.skillsWanted.length ? user.skillsWanted : ['No skills wanted'],
        availability: user.availability || ['Not mentioned'],
        ratings: averageRating,
        profileUrl: `/api/users/${user._id}`,
      };
    });

    res.json({ success: true, users: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch public users' });
  }
});

// New: Get individual public profile
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.isPublic) {
      return res.status(404).json({ success: false, message: 'User not found or is private' });
    }

    const ratingValues = user.ratings?.map(r => r.score) || [];
    const averageRating = ratingValues.length
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
      : "NaN";

    res.json({
      success: true,
      profile: {
        name: user.name,
        location: user.location || 'Not specified',
        photoUrl: user.photoUrl || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png',
        skillsOffered: user.skillsOffered.length ? user.skillsOffered : ['No skills offered'],
        skillsWanted: user.skillsWanted.length ? user.skillsWanted : ['No skills wanted'],
        availability: user.availability || ['Not mentioned'],
        ratings: averageRating,
        profileUrl: `/api/users/${user._id}`,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
});


module.exports = router;