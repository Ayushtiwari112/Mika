'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [form, setForm] = useState<any>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== 'mika123') {
      setMessage('Wrong password');
      return;
    }
    const res = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      setAuthorized(true);
      setMessage('Updated successfully');
    }
  };

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle,_#fff2f6,_#f9ebff)] p-6">
        <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-pink-700">Admin Access</h1>
          <p className="mt-3 text-slate-600">Enter the secret password to update Mika's surprise.</p>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-5 w-full rounded-full border border-pink-200 bg-white/80 px-4 py-3" placeholder="Password" />
          <button onClick={handleSubmit} className="mt-5 w-full rounded-full bg-pink-600 px-4 py-3 font-semibold text-white">Enter</button>
          {message && <p className="mt-4 text-sm text-rose-600">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle,_#fff2f6,_#f9ebff)] px-6 py-10 text-slate-800">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-pink-700">Admin Panel</h1>
        <p className="mt-2 text-slate-600">Change the experience locally and let it update instantly.</p>
        <form className="mt-8 grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span>Title</span>
            <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl border border-pink-200 bg-white/80 px-4 py-3" />
          </label>
          <label className="flex flex-col gap-2">
            <span>Subtitle</span>
            <input value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="rounded-2xl border border-pink-200 bg-white/80 px-4 py-3" />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Love Letter</span>
            <textarea value={form.loveLetter || ''} onChange={(e) => setForm({ ...form, loveLetter: e.target.value })} className="min-h-40 rounded-2xl border border-pink-200 bg-white/80 px-4 py-3" />
          </label>
          <label className="flex flex-col gap-2">
            <span>First Photo Path</span>
            <input value={form.firstPhoto || ''} onChange={(e) => setForm({ ...form, firstPhoto: e.target.value })} className="rounded-2xl border border-pink-200 bg-white/80 px-4 py-3" />
          </label>
          <label className="flex flex-col gap-2">
            <span>Gallery Images (comma separated)</span>
            <input value={(form.gallery || []).join(',')} onChange={(e) => setForm({ ...form, gallery: e.target.value.split(',').map((item: string) => item.trim()) })} className="rounded-2xl border border-pink-200 bg-white/80 px-4 py-3" />
          </label>
          <label className="flex items-center gap-3 md:col-span-2">
            <input type="checkbox" checked={Boolean(form.musicEnabled)} onChange={(e) => setForm({ ...form, musicEnabled: e.target.checked })} />
            <span>Enable music</span>
          </label>
          <div className="md:col-span-2">
            <button className="rounded-full bg-pink-600 px-6 py-3 font-semibold text-white" type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </main>
  );
}
