'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon, LogOut, Layers, Rss, Users, Zap, Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store/useStore';
import clsx from 'clsx';

const navItems = [
  { href: '/feed', label: 'Feed', icon: Rss },
  { href: '/match', label: 'Match', icon: Zap },
  { href: '/teams', label: 'My Teams', icon: Briefcase },
  { href: '/profile', label: 'Profile', icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, theme, toggleTheme, logout } = useStore();
  const [open, setOpen] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-2 mr-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
              <Layers size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight hidden sm:block">SkillSync</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Avatar */}
            <Link href="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white ring-2 ring-white dark:ring-zinc-950 hover:ring-brand-200 transition-all">
              {initials}
            </Link>

            {/* Logout */}
            <button onClick={logout} className="btn-ghost p-2 hidden md:flex" aria-label="Logout">
              <LogOut size={16} />
            </button>

            {/* Mobile menu toggle */}
            <button className="btn-ghost p-2 md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {open && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50" />
          <nav className="absolute top-14 left-0 right-0 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col gap-1" onClick={e => e.stopPropagation()}>
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 dark:text-zinc-400'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <button onClick={logout} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 mt-2">
              <LogOut size={16} /> Sign out
            </button>
          </nav>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-xs font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'text-brand-500'
                  : 'text-zinc-400 dark:text-zinc-500'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
