const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rollNumber: { type: String, default: '' },
  department: { type: String, default: '' },
  year: { type: Number, default: 1 },
  institution: { type: String, default: 'Kumaraguru College of Technology' },
  skills: [String],
  interests: [String],
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  bio: { type: String, default: '' },
  portfolioLinks: [String],
  githubUsername: { type: String, default: '' },
  reputationScore: { type: Number, default: 0 },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

userSchema.methods.toSafeObject = function () {
  const o = this.toObject();
  delete o.password;
  return o;
};

module.exports = mongoose.model('User', userSchema);
