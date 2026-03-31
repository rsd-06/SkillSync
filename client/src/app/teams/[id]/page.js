'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Github, Users, CheckSquare, MessageSquare, Flag,
  Circle, CheckCircle2, Clock, Plus, X, Layout, Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import useStore from '../../../store/useStore';
import clsx from 'clsx';

const TABS = [
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'milestones', label: 'Milestones', icon: Flag },
  { id: 'workspace', label: 'Workspace', icon: Layout },
];

const TASK_STATUS = {
  todo: { label: 'To do', color: 'text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800', icon: Circle },
  inprogress: { label: 'In progress', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: Clock },
  done: { label: 'Done', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: CheckCircle2 },
};

function Avatar({ name, size = 'sm' }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const sz = size === 'sm' ? 'h-7 w-7 text-xs' : size === 'md' ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-sm';
  return (
    <div className={`flex ${sz} shrink-0 items-center justify-center rounded-full bg-brand-500 font-semibold text-white`}>
      {initials}
    </div>
  );
}

function timeAgo(date) {
  const d = Math.floor((Date.now() - new Date(date)) / 1000);
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function TeamWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks');
  const [newTask, setNewTask] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [chatMsg, setChatMsg] = useState('');

  useEffect(() => {
    api.get(`/api/teams/${id}`)
      .then(({ data }) => { setTeam(data); setLoading(false); })
      .catch(() => { toast.error('Failed to load team'); setLoading(false); });
  }, [id]);

  const handleTaskStatus = async (taskId, status) => {
    try {
      const { data } = await api.put(`/api/teams/${id}/tasks/${taskId}`, { status });
      setTeam(data);
    } catch { toast.error('Failed to update task'); }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const { data } = await api.post(`/api/teams/${id}/tasks`, { title: newTask });
      setTeam(data);
      setNewTask('');
      setAddingTask(false);
      toast.success('Task added');
    } catch { toast.error('Failed to add task'); }
  };

  if (loading) return (
    <div className="flex flex-col gap-4 animate-pulse max-w-2xl mx-auto">
      <div className="h-8 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="card p-6 h-40" />
      <div className="card p-6 h-64" />
    </div>
  );

  if (!team) return <div className="card p-12 text-center text-sm text-zinc-400">Team not found.</div>;

  const doneTasks = team.tasks?.filter(t => t.status === 'done').length || 0;
  const totalTasks = team.tasks?.length || 0;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()} className="btn-ghost self-start -ml-2 text-zinc-500">
        <ArrowLeft size={15} /> My Teams
      </button>

      {/* Team header card */}
      <div className="card p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold">{team.name}</h1>
            <p className="text-sm text-zinc-400 mt-0.5 line-clamp-1">{team.idea?.title}</p>
          </div>
          <span className={team.status === 'active' ? 'status-active' : team.status === 'forming' ? 'status-forming' : 'status-completed'}>
            {team.status}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="text-zinc-500">Overall progress</span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-zinc-400 mt-1">{doneTasks} of {totalTasks} tasks done</p>
        </div>

        {/* Members row */}
        <div className="flex items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex -space-x-2">
            {team.members?.map(m => (
              <div key={m.user?._id} title={m.user?.name}>
                <Avatar name={m.user?.name} size="sm" />
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500 truncate">
              {team.members?.map(m => m.user?.name?.split(' ')[0]).join(', ')}
            </p>
          </div>
          {team.githubRepo && (
            <a href={team.githubRepo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-brand-500 transition-colors shrink-0">
              <Github size={13} /> Repo
            </a>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-1">
        {TABS.map(({ id: tid, label, icon: Icon }) => (
          <button key={tid} onClick={() => setTab(tid)}
            className={clsx(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all',
              tab === tid
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            )}>
            <Icon size={13} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── TASKS TAB ────────────────────────────────── */}
      {tab === 'tasks' && (
        <div className="card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Tasks</h2>
            <button onClick={() => setAddingTask(true)} className="btn-ghost text-xs gap-1 text-brand-500">
              <Plus size={13} /> Add task
            </button>
          </div>

          {/* Add task input */}
          {addingTask && (
            <div className="flex gap-2">
              <input
                autoFocus
                placeholder="Task title…"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') { setAddingTask(false); setNewTask(''); } }}
                className="input flex-1 text-sm"
              />
              <button onClick={handleAddTask} className="btn-primary px-3"><Plus size={14} /></button>
              <button onClick={() => { setAddingTask(false); setNewTask(''); }} className="btn-secondary px-3"><X size={14} /></button>
            </div>
          )}

          {/* Group by status */}
          {(['inprogress', 'todo', 'done']).map(st => {
            const tasks = team.tasks?.filter(t => t.status === st) || [];
            if (tasks.length === 0) return null;
            const cfg = TASK_STATUS[st];
            return (
              <div key={st}>
                <div className={`flex items-center gap-2 mb-2 text-xs font-medium ${cfg.color}`}>
                  <cfg.icon size={13} />
                  {cfg.label} · {tasks.length}
                </div>
                <div className="flex flex-col gap-2">
                  {tasks.map(task => (
                    <div key={task._id} className={`flex items-center gap-3 rounded-xl p-3 ${cfg.bg}`}>
                      {/* Cycle status on click */}
                      <button
                        onClick={() => {
                          const next = { todo: 'inprogress', inprogress: 'done', done: 'todo' }[task.status];
                          handleTaskStatus(task._id, next);
                        }}
                        className={`shrink-0 ${cfg.color} hover:scale-110 transition-transform`}
                      >
                        <cfg.icon size={16} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={clsx('text-sm', task.status === 'done' && 'line-through text-zinc-400')}>{task.title}</p>
                        {task.assignee && (
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {task.assignee?.name || 'Assigned'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {totalTasks === 0 && (
            <div className="py-6 text-center text-sm text-zinc-400">
              No tasks yet. Add the first one above.
            </div>
          )}
        </div>
      )}

      {/* ── CHAT TAB ─────────────────────────────────── */}
      {tab === 'chat' && (
        <div className="card flex flex-col" style={{ height: '520px' }}>
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <MessageSquare size={14} className="text-zinc-400" />
            <h2 className="text-sm font-semibold">Team chat</h2>
            <span className="ml-auto text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full px-2 py-0.5">Read-only preview</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {team.chatMessages?.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-sm text-zinc-400">No messages yet.</div>
            )}
            {team.chatMessages?.map((msg, i) => {
              const isMe = msg.sender?._id === user?._id || msg.senderName === user?.name;
              const showName = i === 0 || team.chatMessages[i - 1]?.senderName !== msg.senderName;
              return (
                <div key={i} className={clsx('flex gap-2.5', isMe && 'flex-row-reverse')}>
                  {showName && <Avatar name={msg.senderName} size="sm" />}
                  {!showName && <div className="w-7" />}
                  <div className={clsx('flex flex-col gap-1 max-w-[75%]', isMe && 'items-end')}>
                    {showName && (
                      <span className={clsx('text-xs font-medium text-zinc-500', isMe && 'text-right')}>
                        {isMe ? 'You' : msg.senderName?.split(' ')[0]}
                      </span>
                    )}
                    <div className={clsx(
                      'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      isMe
                        ? 'bg-brand-500 text-white rounded-tr-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm'
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-zinc-400">{timeAgo(msg.sentAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input area — read only for prototype */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex gap-2 items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5">
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                placeholder="Real-time chat coming in v1…"
                className="flex-1 bg-transparent text-sm outline-none text-zinc-400 placeholder:text-zinc-400 cursor-not-allowed"
                readOnly
              />
              <button disabled className="text-zinc-300 dark:text-zinc-600 cursor-not-allowed">
                <Send size={15} />
              </button>
            </div>
            <p className="text-xs text-zinc-400 text-center mt-2">
              Chat is hardcoded for this prototype · Socket.io integration in v1
            </p>
          </div>
        </div>
      )}

      {/* ── MILESTONES TAB ───────────────────────────── */}
      {tab === 'milestones' && (
        <div className="card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Milestones</h2>
          {team.milestones?.length === 0 ? (
            <p className="text-sm text-zinc-400 py-4 text-center">No milestones set.</p>
          ) : (
            <div className="flex flex-col">
              {team.milestones?.map((m, i) => {
                const due = new Date(m.dueDate);
                const overdue = !m.completed && due < new Date();
                const daysLeft = Math.ceil((due - Date.now()) / 86400000);
                return (
                  <div key={i} className="flex items-start gap-4 py-4 border-b last:border-0 border-zinc-100 dark:border-zinc-800">
                    <div className={clsx(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 mt-0.5',
                      m.completed
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'
                        : overdue
                        ? 'border-red-300 bg-red-50 dark:bg-red-950/30 text-red-400'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-400'
                    )}>
                      {m.completed ? <CheckCircle2 size={15} /> : <Flag size={13} />}
                    </div>
                    <div className="flex-1">
                      <p className={clsx('text-sm font-medium', m.completed && 'line-through text-zinc-400')}>{m.title}</p>
                      <p className={clsx('text-xs mt-0.5', overdue ? 'text-red-400' : 'text-zinc-400')}>
                        {m.completed
                          ? 'Completed'
                          : overdue
                          ? `Overdue by ${Math.abs(daysLeft)} days`
                          : daysLeft === 0
                          ? 'Due today'
                          : `${daysLeft} days left`}
                        {' · '}
                        {due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {!m.completed && (
                      <span className={clsx(
                        'text-xs rounded-full px-2.5 py-0.5 font-medium shrink-0',
                        overdue
                          ? 'bg-red-50 dark:bg-red-950/30 text-red-500'
                          : daysLeft <= 7
                          ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-500'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      )}>
                        {overdue ? 'Overdue' : daysLeft <= 7 ? 'Soon' : 'Upcoming'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── WORKSPACE TAB (stub) ─────────────────────── */}
      {tab === 'workspace' && (
        <div className="flex flex-col gap-4">
          {/* Members full view */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Users size={14} /> Members</h2>
            <div className="flex flex-col gap-3">
              {team.members?.map(m => (
                <div key={m.user?._id} className="flex items-center gap-3">
                  <Avatar name={m.user?.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.user?.name}</p>
                    <p className="text-xs text-zinc-400">{m.user?.department} · {m.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {m.user?.skills?.slice(0, 2).map(s => (
                      <span key={s} className="tag text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub */}
          {team.githubRepo && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Github size={14} /> Repository</h2>
              <a href={team.githubRepo} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 transition-colors font-mono">
                {team.githubRepo}
              </a>
            </div>
          )}

          {/* Coming soon stubs */}
          {[
            { icon: '📁', title: 'File sharing', desc: 'Upload and share files with your team' },
            { icon: '📅', title: 'Calendar & meetings', desc: 'Schedule meetings with Google Meet links' },
            { icon: '🖊️', title: 'Whiteboard', desc: 'Collaborative brainstorming canvas' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card p-5 flex items-center gap-4 opacity-60">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-zinc-400">{desc}</p>
              </div>
              <span className="ml-auto text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full px-2.5 py-1 shrink-0">
                Coming in v1
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
