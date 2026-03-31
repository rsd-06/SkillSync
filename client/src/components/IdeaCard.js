'use client';
import Link from 'next/link';
import { Bookmark, Users, Eye, Clock, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const STATUS_DOTS = { open: 'bg-emerald-400', forming: 'bg-amber-400', active: 'bg-blue-400', completed: 'bg-zinc-400' };
const STATUS_LABEL = { open: 'Open', forming: 'Forming', active: 'Active', completed: 'Completed' };
const STATUS_CLASS = { open: 'status-open', forming: 'status-forming', active: 'status-active', completed: 'status-completed' };

function timeAgo(date) {
  const d = Math.floor((Date.now() - new Date(date)) / 1000);
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function IdeaCard({ idea, bookmarked, onBookmark, style }) {
  const memberCount = idea.teamMembers?.length || 0;
  const initials = idea.owner?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className="card p-5 flex flex-col gap-4 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-sm transition-all animate-fade-up"
      style={style}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
              {idea.owner?.name} · {idea.owner?.department} Yr {idea.owner?.year}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 flex items-center gap-1 mt-0.5">
              <Clock size={10} /> {timeAgo(idea.createdAt)}
            </p>
          </div>
        </div>
        <span className={STATUS_CLASS[idea.status]}>
          <span className={clsx('h-1.5 w-1.5 rounded-full', STATUS_DOTS[idea.status])} />
          {STATUS_LABEL[idea.status]}
        </span>
      </div>

      {/* Title + abstract */}
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug mb-1.5">{idea.title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{idea.abstract}</p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {idea.requiredSkills?.slice(0, 4).map(s => (
          <span key={s} className="tag-skill">{s}</span>
        ))}
        {idea.requiredSkills?.length > 4 && (
          <span className="tag">+{idea.requiredSkills.length - 4}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-600">
          <span className="flex items-center gap-1"><Users size={12} />{memberCount}/{idea.teamSize}</span>
          <span className="flex items-center gap-1"><Eye size={12} />{idea.viewCount || 0}</span>
          <span className="flex items-center gap-1"><Bookmark size={12} />{idea.bookmarkCount || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          {onBookmark && (
            <button
              onClick={(e) => { e.preventDefault(); onBookmark(idea._id); }}
              className={clsx('p-1.5 rounded-lg transition-colors', bookmarked ? 'text-brand-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300')}
            >
              <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
          <Link href={`/ideas/${idea._id}`} className="flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors">
            View <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
