const mongoose = require('mongoose');

// User Schema defines the structure of our database document
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// Export the mongoose model to use it in server.js
module.exports = mongoose.model('User', userSchema);
