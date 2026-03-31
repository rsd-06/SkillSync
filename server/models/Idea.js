const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  requiredSkills: [String],
  scope: { type: String, default: '' },
  teamSize: { type: Number, default: 4 },
  visibility: { type: String, enum: ['public', 'vague', 'private'], default: 'public' },
  status: { type: String, enum: ['open', 'forming', 'active', 'completed'], default: 'open' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
  }],
  teamMembers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'Member' }
  }],
  tags: [String],
  bookmarkCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  githubRepo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', ideaSchema);
