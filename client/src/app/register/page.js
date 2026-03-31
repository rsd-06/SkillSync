'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import useStore from '../../store/useStore';

const DEPTS = ['CSE', 'ECE', 'EIE', 'IT', 'Mechanical', 'Civil', 'Chemical', 'Biomedical'];

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useStore(s => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '', rollNumber: '', department: 'CSE', year: 1 });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', form);
      setAuth(data.token, data.user);
      toast.success('Account created! Welcome to SkillSync.');
      router.push('/profile');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2.5 mb-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500">
          <Layers size={18} className="text-white" />
        </div>
        <span className="text-xl font-semibold tracking-tight">SkillSync</span>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">Join the KCT collaboration network</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full name</label>
            <input required placeholder="Sudharshan R" value={form.name}
              onChange={e => set('name', e.target.value)} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">College email</label>
            <input type="email" required placeholder="you@kct.ac.in" value={form.email}
              onChange={e => set('email', e.target.value)} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input type="password" required placeholder="Min 8 characters" value={form.password}
              onChange={e => set('password', e.target.value)} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Roll number</label>
              <input placeholder="22CSE001" value={form.rollNumber}
                onChange={e => set('rollNumber', e.target.value)} className="input" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Year</label>
              <select value={form.year} onChange={e => set('year', Number(e.target.value))} className="input">
                {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Department</label>
            <select value={form.department} onChange={e => set('department', e.target.value)} className="input">
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand-500 hover:text-brand-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
