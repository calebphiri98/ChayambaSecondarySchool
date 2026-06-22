import React, { useState } from 'react';
import API_URL from '../../config/api';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function AdminUsers({ usersDb, setUsersDb, onDelete }) {
  const [userForm, setUserForm] = useState({ id_number: '', password: '', role: 'student', full_name: '' });

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!userForm.id_number || !userForm.password || !userForm.full_name) {
      alert("Please fill in all system access credentials parameters.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      if (response.ok) {
        const created = await response.json();
        setUsersDb([created, ...usersDb]);
        setUserForm({ id_number: '', password: '', role: 'student', full_name: '' });
        alert("System Security Commit: New user schema entity synchronized successfully.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Write operation rejected: ${errorData.error || 'Check database validation attributes.'}`);
      }
    } catch (err) {
      console.error("Pipeline failure routing user registration data node:", err);
      alert("Data pipeline delivery infrastructure communication timeout failure.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* FORM */}
      <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 flex items-center gap-1.5">
          <PlusCircle size={15} /> Register System User
        </h2>
        <form onSubmit={handleAddUser} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Full Identity Name</label>
            <input type="text" required autoComplete="off" placeholder="John Doe" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={userForm.full_name} onChange={e => setUserForm({ ...userForm, full_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">System Access ID Number</label>
            <input type="text" required autoComplete="off" placeholder="Unique ID (e.g. STU-001)" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono" value={userForm.id_number} onChange={e => setUserForm({ ...userForm, id_number: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Account Password</label>
            <input type="password" required autoComplete="new-password" placeholder="••••••••" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Authorization Role</label>
            <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-bold text-[#0c2340]" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="student">Student Portal</option>
              <option value="staff">Staff Desk</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-[#0c2340] text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 transition-colors">Sync Identity Array</button>
        </form>
      </div>

      {/* DIRECTORY TABLE */}
      <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 font-mono">Synchronized Security Cluster Identities</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50">
                <th className="p-3">Identity Entity</th>
                <th className="p-3">ID Target Pattern</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {usersDb.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="p-3 text-slate-900 font-bold">{u.full_name}</td>
                  <td className="p-3 text-slate-600 font-mono">{u.id_number}</td>
                  <td className="p-3">
                    <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${
                      u.role === 'staff'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => onDelete(u.id)} className="text-slate-400 hover:text-rose-600 p-1 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {usersDb.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400 text-xs">No users registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
