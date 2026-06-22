import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Image, MessageSquare, Users, Globe } from 'lucide-react';

export default function AdminOverview({ newsDb, galleryDb, parentQueriesDb, usersDb }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-[#0c2340] uppercase">System Dashboard Overview</h1>
          <p className="text-slate-500 text-xs">Realtime structural node health monitoring diagnostics.</p>
        </div>
        <Link to="/" className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline">
          Live Site View <Globe size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-[#0c2340] rounded-lg"><Newspaper size={20} /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">News Articles</span>
            <span className="text-lg font-black text-[#0c2340] font-mono">{newsDb.length} Logs</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Image size={20} /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Gallery Media</span>
            <span className="text-lg font-black text-[#0c2340] font-mono">{galleryDb.length} Items</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><MessageSquare size={20} /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Parent Requests</span>
            <span className="text-lg font-black text-[#0c2340] font-mono">{parentQueriesDb.length} Alerts</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20} /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Active Users</span>
            <span className="text-lg font-black text-[#0c2340] font-mono">{usersDb.length} Nodes</span>
          </div>
        </div>
      </div>
    </div>
  );
}