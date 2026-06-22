import React from 'react';
import { Trash2, User, BookOpen, MessageSquare, CheckCircle2, Phone, ExternalLink } from 'lucide-react';
import API_URL from '../../config/api';

export default function AdminQueries({ parentQueriesDb, setParentQueriesDb }) {

  const handleResolveQuery = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/queries/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setParentQueriesDb(prev => prev.map(q => q.id === id ? { ...q, status: 'Reviewed' } : q));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuery = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      const response = await fetch(`${API_URL}/api/queries/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setParentQueriesDb(prev => prev.filter(q => q.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#0c2340] tracking-tight">Parent Desk Inbox</h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{parentQueriesDb.length} Active Inquiries</span>
      </div>

      {parentQueriesDb.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">All caught up! No pending queries.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {parentQueriesDb.map((query) => (
            <div 
              key={query.id} 
              className={`group bg-white p-7 rounded-2xl shadow-sm border-l-4 transition-all hover:shadow-md ${
                query.status === 'Reviewed' ? 'border-l-emerald-500' : 'border-l-amber-500'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-[#0c2340]">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-[#0c2340] text-lg leading-tight">{query.sender}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{query.phone || 'No contact provided'}</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-100">
                    <BookOpen size={13} /> {query.subject}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  {query.status !== 'Reviewed' ? (
                    <button
                      onClick={() => handleResolveQuery(query.id)}
                      className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest bg-[#0c2340] hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow"
                    >
                      <CheckCircle2 size={14} /> Resolve
                    </button>
                  ) : (
                    <span className="text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Reviewed
                    </span>
                  )}
                  
                  <button
                    onClick={() => handleDeleteQuery(query.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50/50 rounded-xl border border-slate-100 relative">
                <MessageSquare size={16} className="absolute top-4 left-4 text-slate-300" />
                <p className="pl-7 text-sm text-slate-600 leading-relaxed italic">{query.message}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Received: {new Date(query.created_at).toLocaleDateString()}
                </span>
                {query.phone && (
                  <a 
                    href={`https://wa.me/${query.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 hover:text-emerald-800 transition-colors uppercase tracking-widest"
                  >
                    Open in WhatsApp <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}