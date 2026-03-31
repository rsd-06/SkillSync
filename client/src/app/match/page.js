'use client';
import { useEffect, useState } from 'react';
import { Search, Zap, Star } from 'lucide-react';
import api from '../../lib/api';
import useStore from '../../store/useStore';
import clsx from 'clsx';

const EXP_COLORS = { beginner: 'status-open', intermediate: 'status-forming', advanced: 'status-active' };
const FILTER_SKILLS = ['React', 'Python', 'Flutter', 'Node.js', 'TensorFlow', 'Arduino', 'UI/UX Design', 'MongoDB', 'Embedded C'];
const FILTER_DEPTS = ['CSE', 'ECE', 'EIE', 'IT', 'Mechanical'];

function Avatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
      {name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function MatchPage() {
  const { user } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterDept, setFilterDept] = useState('');

  useEffect(() => {
    api.get('/api/users').then(({ data }) => { setUsers(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  // Compute match score against logged-in user
  const withScore = users.map(u => {
    const mySkills = user?.skills?.map(s => s.toLowerCase()) || [];
    const theirSkills = u.skills?.map(s => s.toLowerCase()) || [];
    const overlap = theirSkills.filter(s => mySkills.includes(s)).length;
    return { ...u, overlapScore: overlap };
  }).sort((a, b) => b.overlapScore - a.overlapScore);

  const filtered = withScore.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterSkill && !u.skills?.includes(filterSkill)) return false;
    if (filterDept && u.department !== filterDept) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Find People</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Discover students by skill — sorted by how well they match you</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input placeholder="Search by name or skill…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" />
      </div>

      {/* Skill filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <button onClick={() => setFilterSkill('')} className={clsx('shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors', !filterSkill ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent' : 'border-zinc-200 dark:border-zinc-700 text-zinc-500')}>
          All
        </button>
        {FILTER_SKILLS.map(s => (
          <button key={s} onClick={() => setFilterSkill(s === filterSkill ? '' : s)}
            className={clsx('shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors', filterSkill === s ? 'bg-brand-500 text-white border-transparent' : 'border-zinc-200 dark:border-zinc-700 text-zinc-500')}>
            {s}
          </button>
        ))}
      </div>

      {/* Department filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <button onClick={() => setFilterDept('')} className={clsx('shrink-0 rounded-full px-3 py-1 text-xs font-medium border', !filterDept ? 'border-zinc-400 text-zinc-700 dark:text-zinc-300' : 'border-zinc-200 dark:border-zinc-700 text-zinc-400')}>
          All depts
        </button>
        {FILTER_DEPTS.map(d => (
          <button key={d} onClick={() => setFilterDept(d === filterDept ? '' : d)}
            className={clsx('shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors', filterDept === d ? 'border-zinc-700 dark:border-zinc-300 text-zinc-700 dark:text-zinc-300' : 'border-zinc-200 dark:border-zinc-700 text-zinc-400')}>
            {d}
          </button>
        ))}
      </div>

      {/* User list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-4 flex gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex-1"><div className="h-4 w-32 rounded bg-zinc-100 dark:bg-zinc-800 mb-2" /><div className="h-3 w-48 rounded bg-zinc-100 dark:bg-zinc-800" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-sm text-zinc-400">No people found with those filters.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((u, i) => (
            <div key={u._id} className="card p-4 flex items-center gap-3 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <Avatar name={u.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{u.name}</span>
                  <span className={EXP_COLORS[u.experienceLevel]}>{u.experienceLevel}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{u.department} · Year {u.year}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {u.skills?.slice(0, 4).map(s => (
                    <span key={s} className={clsx('tag text-xs', filterSkill === s && 'tag-skill')}>
                      {s}
                    </span>
                  ))}
                  {u.skills?.length > 4 && <span className="tag text-xs">+{u.skills.length - 4}</span>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs text-amber-500">
                  <Star size={11} fill="currentColor" />
                  <span className="font-medium">{u.reputationScore}</span>
                </div>
                {u.overlapScore > 0 && (
                  <div className="flex items-center gap-1 text-xs font-medium text-brand-500">
                    <Zap size={11} />
                    {u.overlapScore} match
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
