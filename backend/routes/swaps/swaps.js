// routes/swaps.js
const express = require('express');
const router = express.Router();
const SwapRequest = require('../../models/SwapRequest.model')
const User = require('../../models/User.model');
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
// @route   POST /api/swaps
// @desc    Create a new swap request
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { toUserId, skillOffered, skillRequested, message } = req.body;
    const fromUserId = req.user.id;

    // Basic validation
    if (!toUserId || !skillOffered || !skillRequested) {
      return res.status(400).json({
        success: false,
        message: 'toUserId, skillOffered and skillRequested are required'
      });
    }

    // Check target exists and is public
    const targetUser = await User.findById(toUserId);
    if (!targetUser || !targetUser.isPublic) {
      return res.status(404).json({ success: false, message: 'Target user not found or not public' });
    }

    // Create swap request
    const swap = await SwapRequest.create({
      requester:   fromUserId,
      target:      toUserId,
      skillOffered,
      skillRequested,
      message:     message || ''
    });

    res.status(201).json({
      success: true,
      swapRequest: {
        id:            swap._id,
        requester:     fromUserId,
        target:        toUserId,
        skillOffered,
        skillRequested,
        message:       swap.message,
        status:        swap.status,
        createdAt:     swap.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
