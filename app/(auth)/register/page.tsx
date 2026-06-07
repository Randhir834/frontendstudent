'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import StudentAuthSplitShell from '@/components/layouts/StudentAuthSplitShell';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [parentGuardianName, setParentGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register({
        name, email, password, role: 'student',
        date_of_birth: dateOfBirth,
        school,
        grade,
        parent_guardian_name: parentGuardianName,
        phone,
        location
      });
      router.push('/login');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentAuthSplitShell
      centered={false}
      leftTitle={
        <>
          Start Your
          <br />
          <span className="text-yellow-300">Learning Adventure!</span> <span className="text-2xl">🚀</span>
        </>
      }
      leftSubtitle="Join thousands of young learners building skills with live classes, materials, and progress tracking."
    >
      <div className="w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-2">Create Student Account</h2>
        <p className="text-center text-xs sm:text-sm text-text-muted mb-6 sm:mb-8">Fill in your details to get started</p>

        {error && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-hover text-error text-xs sm:text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-text-primary">Full Name</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                autoComplete="name"
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-text-primary">Email Address</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-text-primary">Password</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
                minLength={8}
                className="w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showPassword ? (
                  <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26"/><path d="M2 2l20 20"/></svg>
                )}
              </button>
            </div>
            <p className="text-xs text-text-muted">Use at least 8 characters.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="dateOfBirth" className="block text-xs sm:text-sm font-medium text-text-primary">Date of Birth</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              </div>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="school" className="block text-xs sm:text-sm font-medium text-text-primary">School</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <input
                id="school"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Enter your school name"
                required
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="grade" className="block text-xs sm:text-sm font-medium text-text-primary">Grade</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <input
                id="grade"
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter your grade"
                required
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="parentGuardianName" className="block text-xs sm:text-sm font-medium text-text-primary">Parent/Guardian Name</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <input
                id="parentGuardianName"
                type="text"
                value={parentGuardianName}
                onChange={(e) => setParentGuardianName(e.target.value)}
                placeholder="Enter parent/guardian name"
                required
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-text-primary">Phone Number</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-text-primary">Location</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                required
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 active:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              'Creating account...'
            ) : (
              <>
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                Create account
              </>
            )}
          </button>
        </form>

      <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-500 hover:text-primary-600 font-semibold">Sign in</Link>
      </p>

      <div className="h-8 sm:h-10 lg:h-12 shrink-0"></div>
      </div>
    </StudentAuthSplitShell>
  );
}
