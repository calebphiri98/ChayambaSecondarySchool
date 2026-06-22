import React, { useState } from 'react';
import API_URL from '../../config/api';
import { Search, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminResetPassword() {
  const [idInput, setIdInput] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  // Step 1: Look up user by ID number
  const handleLookup = async (e) => {
    e.preventDefault();
    setFoundUser(null);
    setLookupError('');
    setResetSuccess('');
    setResetError('');
    setNewPassword('');
    setConfirmPassword('');

    if (!idInput.trim()) return;

    try {
      setLookupLoading(true);
      const res = await fetch(`${API_URL}/api/users`);
      const users = await res.json();
      const match = users.find(u => u.id_number.toLowerCase() === idInput.trim().toLowerCase());
      if (!match) {
        setLookupError('No user found with that ID number.');
      } else {
        setFoundUser(match);
      }
    } catch (err) {
      setLookupError('Failed to reach the server. Try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Step 2: Reset password
  const handleReset = async (e) => {
    e.preventDefault();
    setResetSuccess('');
    setResetError('');

    if (!newPassword || !confirmPassword) {
      setResetError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await fetch(`${API_URL}/api/users/${foundUser.id}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResetError(data.error || 'Reset failed. Try again.');
      } else {
        setResetSuccess(`Password for ${foundUser.full_name} has been reset successfully.`);
        setNewPassword('');
        setConfirmPassword('');
        setFoundUser(null);
        setIdInput('');
      }
    } catch (err) {
      setResetError('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleClear = () => {
    setFoundUser(null);
    setIdInput('');
    setLookupError('');
    setResetSuccess('');
    setResetError('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-sm font-black uppercase text-[#0c2340] tracking-wider flex items-center gap-2">
          <KeyRound size={16} className="text-amber-500" /> Reset User Password
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter the user's ID number to locate their account, then set a new password.
        </p>
      </div>

      {/* Success banner */}
      {resetSuccess && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-start gap-2">
          <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
          <span>{resetSuccess}</span>
        </div>
      )}

      {/* STEP 1: ID lookup */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-4">
        <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">
          Step 1 — Find User by ID
        </h2>
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. CSS-STA-001 or CSS/2026/0492"
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-500 font-mono"
            value={idInput}
            onChange={e => setIdInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={lookupLoading}
            className="bg-[#0c2340] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Search size={13} /> {lookupLoading ? 'Searching...' : 'Find'}
          </button>
        </form>

        {lookupError && (
          <div className="mt-3 text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle size={13} /> {lookupError}
          </div>
        )}

        {/* Found user confirmation card */}
        {foundUser && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-[#0c2340]">{foundUser.full_name}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{foundUser.id_number}</p>
              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 inline-block ${
                foundUser.role === 'staff'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {foundUser.role}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] text-slate-400 hover:text-rose-500 font-bold underline shrink-0"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* STEP 2: Reset form — only shown after user is found */}
      {foundUser && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">
            Step 2 — Set New Password for {foundUser.full_name}
          </h2>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:border-amber-500"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-slate-400 hover:text-[#0c2340]">
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className={`w-full text-xs bg-slate-50 border rounded-lg pl-3 pr-10 py-2.5 focus:outline-none ${
                    confirmPassword && newPassword !== confirmPassword
                      ? 'border-rose-400 focus:border-rose-400'
                      : 'border-slate-200 focus:border-amber-500'
                  }`}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2.5 text-slate-400 hover:text-[#0c2340]">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[10px] text-rose-500 mt-1">Passwords do not match.</p>
              )}
            </div>

            {resetError && (
              <div className="text-xs text-rose-600 flex items-center gap-1.5">
                <AlertCircle size={13} /> {resetError}
              </div>
            )}

            <button
              type="submit"
              disabled={resetLoading || (confirmPassword && newPassword !== confirmPassword)}
              className="w-full bg-amber-500 text-[#0c2340] font-black text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {resetLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}