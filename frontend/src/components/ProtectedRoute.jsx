import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  // Wait for localStorage check to finish before deciding
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-100">
        <Loader2 className="animate-spin text-amber-500" size={28} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verifying Access...</p>
      </div>
    );
  }

  // Not logged in → redirect to portal login
  if (!user) {
    return <Navigate to="/portal" replace />;
  }

  // Logged in but not staff → block access
  if (user.role !== 'staff') {
    return <Navigate to="/portal" replace />;
  }

  return children;
}