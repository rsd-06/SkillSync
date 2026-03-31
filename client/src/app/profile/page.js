'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, X, Github, Star, Edit2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import useStore from '../../store/useStore';

const SKILL_OPTS = ['React', 'Next.js', 'Vue', 'Node.js', 'Python', 'Flask', 'Django', 'TensorFlow', 'Scikit-learn', 'PyTorch', 'Flutter', 'Dart', 'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL', 'Arduino', 'Raspberry Pi', 'Embedded C', 'PCB Design', 'SolidWorks', 'AutoCAD', 'MATLAB', '3D Printing', 'UI/UX Design', 'Figma', 'OpenCV', 'MediaPipe', 'Docker', 'AWS', 'C', 'C++', 'Java', 'Kotlin', 'TypeScript', 'Redis', 'GraphQL'];
const INTEREST_OPTS = ['AI/ML', 'IoT', 'Robotics', 'Web Dev', 'Mobile Dev', 'Data Science', 'Embedded Systems', 'UI/UX', 'Cloud', 'Cybersecurity', 'Blockchain', 'AR/VR', 'Hardware', 'Social Impact', 'EdTech', 'HealthTech', 'Sustainability'];
const DEPTS = ['CSE', 'ECE', 'EIE', 'IT', 'Mechanical', 'Civil', 'Chemical', 'Biomedical'];

export default function ProfilePage() {
  const { user, updateUser } = useStore();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user) setForm({ ...user });
  }, [user]);

  if (!form) return <div className="flex items-center justify-center h-40"><div className="text-zinc-400 text-sm">Loading…</div></div>;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleSkill = (s) => set('skills', form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);
  const toggleInterest = (i) => set('interests', form.interests.includes(i) ? form.interests.filter(x => x !== i) : [...form.interests, i]);
  const addCustomSkill = (s) => {
    const c = s.trim();
    if (c && !form.skills.includes(c)) set('skills', [...form.skills, c]);
    setSkillInput('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/api/users/me', form);
      updateUser(data);
      toast.success('Profile saved');
      setEditingBio(false);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const initials = form.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const expColors = { beginner: 'status-open', intermediate: 'status-forming', advanced: 'status-active' };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold">{form.name}</h1>
              <span className={expColors[form.experienceLevel]}>{form.experienceLevel}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-zinc-400">
              <span>{form.department}</span>
              <span>·</span>
              <span>Year {form.year}</span>
              <span>·</span>
              <span>{form.institution}</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-500">
              <Star size={11} fill="currentColor" />
              <span className="font-medium">{form.reputationScore}</span>
              <span className="text-zinc-400">reputation</span>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary shrink-0">
            <Save size={13} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        {/* Bio */}
        <div className="mt-4">
          {editingBio ? (
            <div className="flex gap-2">
              <textarea rows={2} value={form.bio} onChange={e => set('bio', e.target.value)}
                className="input resize-none text-sm flex-1" placeholder="Tell the campus what you're about…" />
              <button onClick={() => setEditingBio(false)} className="btn-ghost p-2"><Check size={14} /></button>
            </div>
          ) : (
            <div className="flex items-start gap-2 group">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                {form.bio || <span className="text-zinc-400 italic">Add a bio…</span>}
              </p>
              <button onClick={() => setEditingBio(true)} className="opacity-0 group-hover:opacity-100 btn-ghost p-1.5 transition-opacity">
                <Edit2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* GitHub */}
        <div className="mt-4 flex items-center gap-2">
          <Github size={14} className="text-zinc-400" />
          <input value={form.githubUsername} onChange={e => set('githubUsername', e.target.value)}
            placeholder="github username"
            className="text-sm text-zinc-600 dark:text-zinc-400 bg-transparent outline-none border-b border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-brand-400 transition-colors flex-1 py-0.5" />
        </div>
      </div>

      {/* Basic info */}
      <div className="card p-5 flex flex-col gap-4">
        <h2 className="text-sm font-semibold">Basic info</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Department</label>
            <select value={form.department} onChange={e => set('department', e.target.value)} className="input text-sm">
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Year</label>
            <select value={form.year} onChange={e => set('year', Number(e.target.value))} className="input text-sm">
              {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">Experience level</label>
          <div className="flex gap-2">
            {['beginner', 'intermediate', 'advanced'].map(lvl => (
              <button key={lvl} onClick={() => set('experienceLevel', lvl)}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors capitalize ${form.experienceLevel === lvl ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'}`}>
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="card p-5 flex flex-col gap-4">
        <h2 className="text-sm font-semibold">Skills</h2>
        <div className="flex flex-wrap gap-1.5">
          {form.skills?.map(s => (
            <button key={s} onClick={() => toggleSkill(s)}
              className="tag-skill flex items-center gap-1 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition-colors group">
              {s} <X size={10} className="opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input placeholder="Add a skill…" value={skillInput} onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(skillInput); } }}
            className="input flex-1 text-sm" />
          <button onClick={() => addCustomSkill(skillInput)} className="btn-secondary px-3"><Plus size={14} /></button>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-1.5">
            {SKILL_OPTS.filter(s => !form.skills?.includes(s)).slice(0, 12).map(s => (
              <button key={s} onClick={() => toggleSkill(s)}
                className="text-xs rounded-md border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-zinc-500 hover:border-brand-300 hover:text-brand-600 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="card p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTS.map(i => (
            <button key={i} onClick={() => toggleInterest(i)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors ${form.interests?.includes(i) ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'}`}>
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Roll no (read-only display) */}
      {form.rollNumber && (
        <div className="card p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Roll number</span>
            <span className="font-mono text-sm">{form.rollNumber}</span>
          </div>
        </div>
      )}
    </div>
  );
}
