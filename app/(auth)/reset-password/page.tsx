'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StudentAuthSplitShell from '@/components/layouts/StudentAuthSplitShell';
import { authService } from '@/services/authService';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Missing reset token. Open the link from your email or server log.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setDone(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Could not reset password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-text-primary text-center mb-2">Set a new password</h2>
      <p className="text-center text-sm text-text-muted mb-8">
        Choose a strong password for your student account.
      </p>

      {done ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">Your password was updated. You can sign in now.</p>
          <Link
            href="/login"
            className="inline-flex w-full py-3 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 active:bg-primary-700 transition-colors items-center justify-center gap-2 shadow-sm"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 rounded-lg bg-hover text-error text-sm text-center">{error}</div>}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-text-primary">
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirm" className="block text-sm font-medium text-text-primary">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 active:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? 'Saving...' : 'Update password'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        <Link href="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
          Back to sign in
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <StudentAuthSplitShell
      leftTitle={
        <>
          Secure Your
          <br />
          <span className="text-yellow-300">Account</span> <span className="text-2xl">🔒</span>
        </>
      }
      leftSubtitle="Pick a new password to keep your learning progress and profile safe."
    >
      <Suspense fallback={<p className="text-center text-sm text-text-muted">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </StudentAuthSplitShell>
  );
}
