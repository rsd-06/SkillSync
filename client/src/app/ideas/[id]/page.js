'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Eye, Bookmark, Github, Send, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import useStore from '@/store/useStore';
import clsx from 'clsx';

const STATUS_CLASS = { open: 'status-open', forming: 'status-forming', active: 'status-active', completed: 'status-completed' };
const STATUS_DOT = { open: 'bg-emerald-400', forming: 'bg-amber-400', active: 'bg-blue-400', completed: 'bg-zinc-400' };

function Avatar({ name, size = 8 }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div className={`flex h-${size} w-${size} shrink-0 items-center justify-center rounded-full bg-brand-500 text-${size > 8 ? 'sm' : 'xs'} font-semibold text-white`}>
      {initials}
    </div>
  );
}

export default function IdeaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [idea, setIdea] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState('');
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/ideas/${id}`);
        setIdea(data);
        const { data: m } = await api.get(`/api/users/match/${id}`);
        setMatches(m);
      } catch { toast.error('Failed to load idea'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/api/ideas/${id}/apply`, { message: applyMsg });
      toast.success('Application sent!');
      setShowApply(false);
      setApplyMsg('');
      const { data } = await api.get(`/api/ideas/${id}`);
      setIdea(data);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to apply'); }
    finally { setApplying(false); }
  };

  const handleApplicant = async (uid, status) => {
    try {
      await api.put(`/api/ideas/${id}/applicants/${uid}`, { status });
      toast.success(status === 'accepted' ? 'Accepted!' : 'Rejected');
      const { data } = await api.get(`/api/ideas/${id}`);
      setIdea(data);
    } catch { toast.error('Failed'); }
  };

  if (loading) return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-8 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="card p-6"><div className="h-6 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800 mb-4" /><div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800 mb-2" /><div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" /></div>
    </div>
  );
  if (!idea) return <div className="card p-12 text-center text-sm text-zinc-500">Idea not found.</div>;

  const isOwner = idea.owner?._id === user?._id;
  const isMember = idea.teamMembers?.some(m => m.user?._id === user?._id);
  const hasApplied = idea.applicants?.some(a => a.user?._id === user?._id);
  const slotsLeft = idea.teamSize - (idea.teamMembers?.length || 0);

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()} className="btn-ghost self-start -ml-2 text-zinc-500">
        <ArrowLeft size={15} /> Back
      </button>

      {/* Main card */}
      <div className="card p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <span className={STATUS_CLASS[idea.status]}>
            <span className={clsx('h-1.5 w-1.5 rounded-full', STATUS_DOT[idea.status])} />
            {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
          </span>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><Eye size={12} />{idea.viewCount}</span>
            <span className="flex items-center gap-1"><Bookmark size={12} />{idea.bookmarkCount}</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-semibold leading-snug mb-3">{idea.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{idea.abstract}</p>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Team slots', value: `${idea.teamMembers?.length || 0} / ${idea.teamSize}` },
            { label: 'Applicants', value: idea.applicants?.length || 0 },
            { label: 'Scope', value: idea.scope || 'Not specified' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3">
              <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
              <p className="text-sm font-medium truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">Skills needed</p>
          <div className="flex flex-wrap gap-1.5">
            {idea.requiredSkills?.map(s => <span key={s} className="tag-skill">{s}</span>)}
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <Avatar name={idea.owner?.name} size={9} />
          <div>
            <p className="text-sm font-medium">{idea.owner?.name}</p>
            <p className="text-xs text-zinc-400">{idea.owner?.department} · Year {idea.owner?.year} · ⭐ {idea.owner?.reputationScore}</p>
          </div>
        </div>

        {/* GitHub */}
        {idea.githubRepo && (
          <a href={idea.githubRepo} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-brand-500 transition-colors">
            <Github size={15} /> {idea.githubRepo.replace('https://github.com/', '')}
          </a>
        )}

        {/* Actions */}
        {!isOwner && !isMember && idea.status !== 'completed' && (
          <div>
            {!showApply ? (
              <button onClick={() => setShowApply(true)} disabled={hasApplied || slotsLeft === 0}
                className={clsx('btn-primary w-full', hasApplied && 'opacity-60 cursor-not-allowed')}>
                {hasApplied ? '✓ Applied' : slotsLeft === 0 ? 'Team full' : 'Apply to join'}
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <textarea rows={2} placeholder="Introduce yourself and why you're a good fit…"
                  value={applyMsg} onChange={e => setApplyMsg(e.target.value)}
                  className="input resize-none text-sm" />
                <div className="flex gap-2">
                  <button onClick={handleApply} disabled={applying} className="btn-primary flex-1">
                    <Send size={13} /> {applying ? 'Sending…' : 'Send application'}
                  </button>
                  <button onClick={() => setShowApply(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Team members */}
      {idea.teamMembers?.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2"><Users size={15} /> Team</p>
          <div className="flex flex-col gap-3">
            {idea.teamMembers.map(m => (
              <div key={m.user?._id} className="flex items-center gap-3">
                <Avatar name={m.user?.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.user?.name}</p>
                  <p className="text-xs text-zinc-400">{m.user?.department} · {m.role}</p>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {m.user?.skills?.slice(0, 2).map(s => <span key={s} className="tag text-xs">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owner — applicants panel */}
      {isOwner && idea.applicants?.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-semibold mb-4">Applicants ({idea.applicants.filter(a => a.status === 'pending').length} pending)</p>
          <div className="flex flex-col gap-3">
            {idea.applicants.map(a => (
              <div key={a.user?._id} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <Avatar name={a.user?.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.user?.name}</p>
                  <p className="text-xs text-zinc-400 mb-1">{a.user?.department}</p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {a.user?.skills?.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
                  </div>
                  {a.message && <p className="text-xs text-zinc-500 italic">"{a.message}"</p>}
                </div>
                {a.status === 'pending' ? (
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => handleApplicant(a.user._id, 'accepted')}
                      className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors">
                      <CheckCircle size={16} />
                    </button>
                    <button onClick={() => handleApplicant(a.user._id, 'rejected')}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <span className={clsx('text-xs font-medium rounded-full px-2 py-0.5', a.status === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-red-50 dark:bg-red-950/30 text-red-500')}>
                    {a.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill match suggestions */}
      {matches.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-semibold mb-1 flex items-center gap-2"><Zap size={14} className="text-brand-500" /> Suggested contributors</p>
          <p className="text-xs text-zinc-400 mb-4">Matched by skill overlap with this idea's requirements</p>
          <div className="flex flex-col gap-3">
            {matches.slice(0, 5).map(u => (
              <div key={u._id} className="flex items-center gap-3">
                <Avatar name={u.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-zinc-400">{u.department} · Yr {u.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {u.skills?.filter(s => idea.requiredSkills?.includes(s)).slice(0, 2).map(s => (
                      <span key={s} className="tag-skill">{s}</span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-brand-500 shrink-0">{u.matchScore}/{idea.requiredSkills?.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
