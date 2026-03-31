'use client';
import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import useStore from '../../store/useStore';
import IdeaCard from '../../components/IdeaCard';
import PostIdeaModal from '../../components/PostIdeaModal';
import clsx from 'clsx';

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'forming', label: 'Forming' },
  { value: 'active', label: 'Active' },
];

const SKILLS = ['React', 'Python', 'Flutter', 'Node.js', 'TensorFlow', 'Arduino', 'UI/UX Design', 'MongoDB', 'Flask', 'Raspberry Pi'];

export default function FeedPage() {
  const { user, refreshUser } = useStore();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [skill, setSkill] = useState('');
  const [showPost, setShowPost] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (status) params.status = status;
      if (skill) params.skill = skill;
      if (search) params.search = search;
      const { data } = await api.get('/api/ideas', { params });
      setIdeas(data);
    } catch {
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  }, [status, skill, search]);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  useEffect(() => {
    if (user?.bookmarks) setBookmarks(new Set(user.bookmarks.map(String)));
  }, [user]);

  const handleBookmark = async (ideaId) => {
    try {
      await api.post(`/api/users/me/bookmark/${ideaId}`);
      setBookmarks(prev => {
        const next = new Set(prev);
        if (next.has(ideaId)) next.delete(ideaId); else next.add(ideaId);
        return next;
      });
      await refreshUser();
    } catch { toast.error('Failed to bookmark'); }
  };

  const clearFilters = () => { setSearch(''); setStatus(''); setSkill(''); };
  const hasFilters = search || status || skill;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Idea Feed</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {loading ? 'Loading…' : `${ideas.length} idea${ideas.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setShowPost(true)} className="btn-primary">
          <Plus size={15} /> Post idea
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text" placeholder="Search ideas…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {STATUSES.map(s => (
            <button key={s.value} onClick={() => setStatus(s.value === status ? '' : s.value)}
              className={clsx('shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border',
                status === s.value
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
              )}>
              {s.label}
            </button>
          ))}
          <div className="w-px bg-zinc-200 dark:bg-zinc-700 shrink-0 mx-1" />
          {SKILLS.map(s => (
            <button key={s} onClick={() => setSkill(s === skill ? '' : s)}
              className={clsx('shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border',
                skill === s
                  ? 'bg-brand-500 text-white border-transparent'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
              )}>
              {s}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearFilters} className="shrink-0 flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium text-red-500 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Ideas grid */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5 h-52 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="flex-1"><div className="h-3 w-32 rounded bg-zinc-100 dark:bg-zinc-800 mb-2" /><div className="h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-800" /></div>
              </div>
              <div className="h-5 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800 mb-3" />
              <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800 mb-2" />
              <div className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">No ideas found.</p>
          {hasFilters && <button onClick={clearFilters} className="mt-3 text-sm text-brand-500 hover:underline">Clear filters</button>}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {ideas.map((idea, i) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              bookmarked={bookmarks.has(idea._id)}
              onBookmark={handleBookmark}
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      )}

      {showPost && <PostIdeaModal onClose={() => setShowPost(false)} onCreated={() => { setShowPost(false); fetchIdeas(); }} />}
    </div>
  );
}
