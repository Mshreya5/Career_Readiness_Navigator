const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    // Not required at schema level so existing/demo users created without a
    // password (e.g. by Member 4's /api/roadmap/student upsert) keep working.
    select: false
  },
  skills: {
    type: [String],
    default: []
  },
  selectedCareer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    default: null
  }
}, { timestamps: true });

// Hash password automatically whenever it is set/changed
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Instance helper to compare a plaintext password with the stored hash
userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
