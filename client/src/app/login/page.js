'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layers, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import useStore from '../../store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useStore(s => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDemo = (email) => setForm({ email, password: 'demo1234' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      setAuth(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      router.push('/feed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
          <Layers size={18} className="text-white" />
        </div>
        <span className="text-xl font-semibold tracking-tight">SkillSync</span>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">Sign in to your KCT account</p>
        </div>

        {/* Demo accounts */}
        <div className="mb-6 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">Demo accounts — click to fill</p>
          <div className="flex flex-col gap-2">
            {[
              { name: 'Sudharshan R', email: 'sudharshan@kct.ac.in', dept: 'EIE, Yr 1' },
              { name: 'Priya Meenakshi', email: 'priya@kct.ac.in', dept: 'CSE, Yr 2' },
              { name: 'Arjun Senthil', email: 'arjun@kct.ac.in', dept: 'CSE, Yr 3' },
            ].map(u => (
              <button key={u.email} onClick={() => handleDemo(u.email)}
                className="flex items-center gap-3 rounded-lg border border-zinc-100 dark:border-zinc-800 px-3 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                  {u.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p className="text-xs font-medium">{u.name}</p>
                  <p className="text-xs text-zinc-400">{u.dept}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email" required placeholder="you@kct.ac.in"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input pr-10"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          No account?{' '}
          <Link href="/register" className="font-medium text-brand-500 hover:text-brand-600">Create one</Link>
        </p>
      </div>
    </div>
  );
}
