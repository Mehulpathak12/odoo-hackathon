const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name:               { type: String,  required: true },
    email:              { type: String,  required: true, unique: true },
    passwordHash:       { type: String,  required: true },
  
    location:           { type: String,  default: '' },
    photoUrl:           { type: String,  default: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png' },
  
    skillsOffered:      { type: [String], default: [] },
    skillsWanted:       { type: [String], default: [] },
  
    availability:       { type: [String], default: [] },
  
    isPublic:           { type: Boolean, default: true },
  
    role:
    { 
        type: String, 
        enum: ['user','admin'], 
        default: 'user' 
    },
    
    swapRequests:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' }],

    ratings: [{ 
      from:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score:  { type: Number, min: 1, max: 5 },
      note:   { type: String }
    }],
    
  }, { timestamps: true });
  UserSchema.index({ skillsOffered: 1, isPublic: 1 });

  module.exports = mongoose.model("User", UserSchema);