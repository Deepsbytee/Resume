require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow cross-origin requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend files

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- API ROUTES ---

// 1. User Registration Logic
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation (email is checked via model/frontend, but let's check duplicates)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email or username' });
    }

    // Security: Hash the password securely using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Registration successful! You can now login.' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// 2. User Login Logic
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Verify user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password matches hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create a JSON Web Token (JWT) for the session
    // 'rememberMe' dictates if the token lasts 30 days or just 1 hour
    const tokenOptions = { expiresIn: rememberMe ? '30d' : '1h' };
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, tokenOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token, // This token will be saved on frontend
      user: { username: user.username, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// 3. Protected Route Middleware (Checks if user is logged in)
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
  if (!token) return res.status(401).json({ success: false, message: 'Access denied: No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Token invalid or expired. Please login again.' });
    req.user = user;
    next(); // Valid user, proceed to the requested route
  });
};

// 4. Protected Dashboard Data endpoint
app.get('/api/user/dashboard', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to your private dashboard!',
    user: req.user
  });
});

// --- App Startup ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
