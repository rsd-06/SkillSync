'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Users, CheckCircle, Clock, Github } from 'lucide-react';
import api from '../../lib/api';
import clsx from 'clsx';

const STATUS_CLASS = { forming: 'status-forming', active: 'status-active', completed: 'status-completed' };

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/teams').then(({ data }) => { setTeams(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-7 w-40 rounded bg-zinc-100 dark:bg-zinc-800" />
      {[1, 2].map(i => <div key={i} className="card p-5 h-36" />)}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Teams</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Your active project teams</p>
      </div>

      {teams.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-zinc-400">You're not in any teams yet.</p>
          <p className="text-xs text-zinc-400 mt-1">Apply to an idea from the feed to join a team.</p>
          <Link href="/feed" className="mt-4 inline-block btn-primary">Browse ideas</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {teams.map((team, i) => {
            const done = team.tasks?.filter(t => t.status === 'done').length || 0;
            const total = team.tasks?.length || 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Link key={team._id} href={`/teams/${team._id}`}
                className="card p-5 flex flex-col gap-4 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-sm transition-all animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{team.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{team.idea?.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={STATUS_CLASS[team.status]}>{team.status}</span>
                    <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-600" />
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {team.members?.slice(0, 4).map(m => (
                      <div key={m.user?._id} className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white ring-2 ring-white dark:ring-zinc-900">
                        {m.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-zinc-400">{team.members?.length} members</span>
                  {team.githubRepo && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-zinc-400"><Github size={11} /> linked</span>
                  )}
                </div>

                {/* Task progress */}
                {total > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-zinc-400">Tasks</span>
                      <span className="text-xs font-medium">{done}/{total} done</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1">
                  {team.idea?.requiredSkills?.slice(0, 4).map(s => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
