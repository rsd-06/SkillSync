'use client';
import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const SKILL_SUGGESTIONS = ['React', 'Next.js', 'Node.js', 'Python', 'Flask', 'Django', 'TensorFlow', 'Scikit-learn', 'Flutter', 'Firebase', 'MongoDB', 'PostgreSQL', 'Arduino', 'Raspberry Pi', 'Embedded C', 'UI/UX Design', 'Figma', 'MATLAB', 'SolidWorks', 'OpenCV'];

export default function PostIdeaModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', abstract: '', scope: '',
    teamSize: 4, visibility: 'public', status: 'open',
    requiredSkills: [], tags: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addSkill = (s) => {
    const clean = s.trim();
    if (clean && !form.requiredSkills.includes(clean)) {
      setForm(p => ({ ...p, requiredSkills: [...p.requiredSkills, clean] }));
    }
    setSkillInput('');
  };
  const removeSkill = (s) => setForm(p => ({ ...p, requiredSkills: p.requiredSkills.filter(x => x !== s) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.abstract) return toast.error('Title and abstract are required');
    setLoading(true);
    try {
      await api.post('/api/ideas', form);
      toast.success('Idea posted!');
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60" />
      <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="font-semibold">Post an idea</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <input required placeholder="e.g. AI Campus Navigation App" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Abstract <span className="text-zinc-400 font-normal">(describe the idea clearly)</span></label>
            <textarea required rows={3} placeholder="What problem does it solve? How does it work?"
              value={form.abstract} onChange={e => setForm(p => ({ ...p, abstract: e.target.value }))}
              className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Team size</label>
              <select value={form.teamSize} onChange={e => setForm(p => ({ ...p, teamSize: Number(e.target.value) }))} className="input">
                {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} people</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Visibility</label>
              <select value={form.visibility} onChange={e => setForm(p => ({ ...p, visibility: e.target.value }))} className="input">
                <option value="public">Public</option>
                <option value="vague">Vague mode</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Scope <span className="text-zinc-400 font-normal">(optional)</span></label>
            <input placeholder="e.g. 3-month project, MVP in 6 weeks" value={form.scope}
              onChange={e => setForm(p => ({ ...p, scope: e.target.value }))} className="input" />
          </div>

          {/* Skills */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Required skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.requiredSkills.map(s => (
                <span key={s} className="tag-skill flex items-center gap-1">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500"><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input placeholder="Type a skill…" value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                className="input flex-1" />
              <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary px-3">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SKILL_SUGGESTIONS.filter(s => !form.requiredSkills.includes(s)).slice(0, 8).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)}
                  className="text-xs rounded-md border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-zinc-500 hover:border-brand-300 hover:text-brand-600 transition-colors">
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Posting…' : 'Post idea'}
          </button>
        </form>
      </div>
    </div>
  );
}
