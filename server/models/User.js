const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  // OAuth fields (existing)
  googleId: { type: String, sparse: true, unique: true },
  
  // Local auth fields (new)
  username: { type: String, sparse: true, unique: true },
  password: { type: String }, // Argon2 hashed password
  
  // Common fields
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: String,
  
  // Account security
  authMethod: { type: String, enum: ['google', 'local', 'both'], required: true },
  failedLoginAttempts: { type: Number, default: 0 },
  accountLockedUntil: { type: Date },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

// Method to hash password with Argon2
userSchema.methods.hashPassword = async function(plainPassword) {
  try {
    // Argon2id is the recommended variant (combines Argon2i and Argon2d)
    this.password = await argon2.hash(plainPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1
    });
  } catch (err) {
    throw new Error('Error hashing password');
  }
};

// Method to verify password
userSchema.methods.verifyPassword = async function(plainPassword) {
  try {
    return await argon2.verify(this.password, plainPassword);
  } catch (err) {
    return false;
  }
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.accountLockedUntil && this.accountLockedUntil > Date.now());
};

// Method to increment failed login attempts
userSchema.methods.incrementFailedAttempts = async function() {
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts for 15 minutes
  if (this.failedLoginAttempts >= 5) {
    this.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000);
  }
  
  await this.save();
};

// Method to reset failed login attempts
userSchema.methods.resetFailedAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = undefined;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
