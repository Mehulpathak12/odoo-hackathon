const mongoose = require("mongoose");
const SwapRequestSchema = new mongoose.Schema({
    requester:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
    // skill names they want to swap
    skillOffered:   { type: String, required: true },
    skillRequested:{ type: String, required: true },
  
    status:         { 
                      type: String, 
                      enum: ['pending','accepted','rejected','cancelled'], 
                      default: 'pending' 
                    },
  
    // after swap, either user can leave feedback
    feedback: {
      from:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating:       { type: Number, min: 1, max: 5 },
      comment:      { type: String }
    }
  
  }, { timestamps: true });
  
  module.exports = mongoose.model("SwapRequest",SwapRequestSchema);