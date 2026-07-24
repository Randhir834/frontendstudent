'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { userService } from '@/services/userService';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation checks
  const isMinLength = newPassword.length >= 8;
  const isMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!isMinLength) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (!isMatch) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await userService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      setSuccess(res.message || 'Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.push('/student/profile');
      }, 2500);
    } catch (err: any) {
      console.error(err);
      const apiError = err?.response?.data?.error || 'Failed to update password. Please check your credentials.';
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">Security Settings</h1>
        <p className="text-sm text-[#64748B]">Manage your account's password and authentication credentials.</p>
      </div>

      <Card className="border border-[#E2E8F0] shadow-md rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-[#F1F5F9] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#1B8A44]">
              <Lock size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#1E293B]">Change Password</CardTitle>
              <p className="text-xs text-[#64748B]">Choose a strong, unique password to secure your account</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Success!</span>
                <span className="text-xs">{success} Redirecting to your profile...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B] flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Error Updating Password</span>
                <span className="text-xs">{error}</span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div className="space-y-1.5">
              <label htmlFor="oldPassword" className="block text-sm font-semibold text-[#334155]">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#1B8A44]/20 focus:border-[#1B8A44] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
                >
                  {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-[#334155]">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create brand new password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#1B8A44]/20 focus:border-[#1B8A44] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
                >
                  {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#334155]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#1B8A44]/20 focus:border-[#1B8A44] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/student/profile')}
                disabled={loading}
                className="px-5 py-3 rounded-xl border border-[#CBD5E1] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#CBD5E1] disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isMinLength || !isMatch}
                className="px-6 py-3 rounded-xl bg-[#1B8A44] hover:bg-[#15803D] active:bg-[#166534] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
