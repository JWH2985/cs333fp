const express = require('express');
const router = express.Router();
const User = require('../models/User');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const zxcvbn = require('zxcvbn');

// Rate limiter for login attempts (prevents brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: 'Too many accounts created. Please try again later.',
});

// Password strength validation
function validatePassword(password) {
  const result = zxcvbn(password);
  
  if (result.score < 3) {  // Score 0-4, require at least 3
    return {
      isValid: false,
      errors: [
        'Password is too weak. Suggestions:',
        ...result.feedback.suggestions,
        result.feedback.warning
      ].filter(Boolean)
    };
  }
  
  return { isValid: true, errors: [] };
}

// POST /auth/local/register - Register new user with password
router.post('/local/register', registerLimiter, async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    
    // Validate input
    if (!username || !email || !password || !name) {
      return res.status(400).json({ 
        error: 'All fields are required',
        fields: { username, email, password, name }
      });
    }
    
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate username (alphanumeric, 3-20 chars)
    if (!validator.isAlphanumeric(username) || username.length < 3 || username.length > 20) {
      return res.status(400).json({ 
        error: 'Username must be 3-20 alphanumeric characters' 
      });
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet security requirements',
        details: passwordValidation.errors
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.username === username 
          ? 'Username already taken' 
          : 'Email already registered'
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      name,
      authMethod: 'local'
    });
    
    // Hash password with Argon2
    await user.hashPassword(password);
    await user.save();
    
    // Don't send password hash back
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name
    };
    
    res.status(201).json({ 
      message: 'Account created successfully',
      user: userResponse
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// POST /auth/local/login - Login with username/password
router.post('/local/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    // Find user (allow login with username OR email)
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });
    
    if (!user || user.authMethod !== 'local') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if account is locked
    if (user.isLocked()) {
      const unlockTime = Math.ceil((user.accountLockedUntil - Date.now()) / 60000);
      return res.status(423).json({ 
        error: `Account locked. Try again in ${unlockTime} minutes.`,
        lockedUntil: user.accountLockedUntil
      });
    }
    
    // Verify password with Argon2
    const isValid = await user.verifyPassword(password);
    
    if (!isValid) {
      await user.incrementFailedAttempts();
      
      const attemptsLeft = 5 - user.failedLoginAttempts;
      if (attemptsLeft > 0) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          attemptsLeft: attemptsLeft
        });
      } else {
        return res.status(423).json({ 
          error: 'Account locked due to too many failed attempts. Try again in 15 minutes.'
        });
      }
    }
    
    // Successful login - reset failed attempts
    await user.resetFailedAttempts();
    user.lastLogin = new Date();
    await user.save();
    
    // Create session
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create session' });
      }
      
      res.json({ 
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          picture: user.picture
        }
      });
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
