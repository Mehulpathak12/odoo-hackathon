// routes/swaps.js
const express = require('express');
const router = express.Router();
const SwapRequest = require('../../models/SwapRequest.model')
const User = require('../../models/User.model');
const jwt = require('jsonwebtoken');
require('dotenv').config()
function authMiddleware(req, res, next) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }
// @route   POST /api/swaps
// @desc    Create a new swap request
// @access  Private
router.post('/swaps', authMiddleware, async (req, res) => {

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
router.get('/swaps', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const swaps = await SwapRequest.find({
      $or: [{ requester: userId }, { target: userId }]
    })
    .populate('requester', 'name photoUrl')
    .populate('target', 'name photoUrl')
    .sort({ createdAt: -1 });

    res.json({ success: true, swaps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not fetch swaps' });
  }
});
router.put('/swaps/:id/respond', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    if (swap.target.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to respond to this request' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Swap request already responded to' });
    }

    swap.status = status;
    await swap.save();

    res.json({ success: true, message: `Swap request ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error responding to swap request' });
  }
});

module.exports = router;
