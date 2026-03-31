const router = require('express').Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find({ 'members.user': req.user._id })
      .populate('idea', 'title status requiredSkills')
      .populate('members.user', 'name skills department');
    res.json(teams);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('idea', 'title status requiredSkills abstract githubRepo')
      .populate('members.user', 'name skills department year')
      .populate('tasks.assignee', 'name')
      .populate('chatMessages.sender', 'name');
    if (!team) return res.status(404).json({ error: 'Not found' });
    res.json(team);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/tasks', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Not found' });
    team.tasks.push({ title: req.body.title, assignee: req.body.assignee, dueDate: req.body.dueDate });
    await team.save();
    res.json(team);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/tasks/:tid', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    const task = team?.tasks.id(req.params.tid);
    if (!task) return res.status(404).json({ error: 'Not found' });
    Object.assign(task, req.body);
    await team.save();
    res.json(team);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
