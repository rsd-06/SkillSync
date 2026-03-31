const router = require('express').Router();
const Idea = require('../models/Idea');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { skill, status, search } = req.query;
    const q = { visibility: { $ne: 'private' } };
    if (status) q.status = status;
    if (skill) q.requiredSkills = skill;
    if (search) q.$or = [{ title: { $regex: search, $options: 'i' } }, { abstract: { $regex: search, $options: 'i' } }];
    const ideas = await Idea.find(q)
      .populate('owner', 'name department year skills')
      .populate('teamMembers.user', 'name')
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const idea = await Idea.create({ ...req.body, owner: req.user._id });
    await idea.populate('owner', 'name department year');
    res.status(201).json(idea);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true })
      .populate('owner', 'name department year skills reputationScore')
      .populate('applicants.user', 'name skills department')
      .populate('teamMembers.user', 'name skills department');
    if (!idea) return res.status(404).json({ error: 'Not found' });
    res.json(idea);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/apply', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Not found' });
    if (idea.owner.toString() === req.user._id.toString()) return res.status(400).json({ error: 'Cannot apply to own idea' });
    if (idea.applicants.find(a => a.user.toString() === req.user._id.toString())) return res.status(400).json({ error: 'Already applied' });
    idea.applicants.push({ user: req.user._id, message: req.body.message || '' });
    await idea.save();
    res.json({ message: 'Applied successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/applicants/:uid', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea || idea.owner.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
    const app = idea.applicants.find(a => a.user.toString() === req.params.uid);
    if (!app) return res.status(404).json({ error: 'Applicant not found' });
    app.status = req.body.status;
    if (req.body.status === 'accepted' && !idea.teamMembers.find(m => m.user.toString() === req.params.uid))
      idea.teamMembers.push({ user: req.params.uid, role: req.body.role || 'Member' });
    await idea.save();
    res.json(idea);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
