const router = require('express').Router();
const User = require('../models/User');
const Idea = require('../models/Idea');
const auth = require('../middleware/auth');

router.get('/me', auth, (req, res) => res.json(req.user.toSafeObject()));

router.put('/me', auth, async (req, res) => {
  try {
    const fields = ['name', 'bio', 'skills', 'interests', 'experienceLevel', 'portfolioLinks', 'githubUsername', 'department', 'year'];
    const updates = {};
    fields.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/match/:ideaId', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    const required = idea.requiredSkills.map(s => s.toLowerCase());
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    const matched = users
      .map(u => ({ ...u.toObject(), matchScore: u.skills.filter(s => required.includes(s.toLowerCase())).length }))
      .filter(u => u.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
    res.json(matched);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/me/bookmark/:ideaId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const id = req.params.ideaId;
    const idx = user.bookmarks.findIndex(b => b.toString() === id);
    if (idx > -1) user.bookmarks.splice(idx, 1); else user.bookmarks.push(id);
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password').limit(30);
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
