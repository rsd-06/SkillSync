const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  name: { type: String, required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'Member' }
  }],
  tasks: [{
    title: String,
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
    dueDate: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  milestones: [{
    title: String,
    dueDate: Date,
    completed: { type: Boolean, default: false }
  }],
  chatMessages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    text: String,
    sentAt: { type: Date, default: Date.now }
  }],
  githubRepo: { type: String, default: '' },
  status: { type: String, enum: ['forming', 'active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);
