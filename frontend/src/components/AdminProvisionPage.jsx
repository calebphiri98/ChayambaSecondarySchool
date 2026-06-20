import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, UserPlus, ShieldCheck, Users, Trash2, Search, ArrowLeft, Key, Mail, Fingerprint, Loader2 } from 'lucide-react';
import API_URL from '../config/api'

export default function AdminProvisionPage() {
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [successNotification, setSuccessNotification] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    assignedId: '',
    role: 'student',
    temporaryPassword: ''
  });

  // Fetch registered profiles dynamically from database on component mount
  const fetchUsersRegistry = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/users`);
      if (!response.ok) throw new Error('Failed to download active credential matrices');
      const data = await response.json();
      setActiveUsers(data);
    } catch (err) {
      console.error('Identity array cluster synchronization breakdown:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsersRegistry();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.assignedId || !formData.temporaryPassword) return;

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: formData.assignedId.toUpperCase(),
          password: formData.temporaryPassword,
          role: formData.role,
          fullName: formData.fullName
        })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Failed to initialize identity block.');
        return;
      }

      setSuccessNotification(`Successfully provisioned database account for ${formData.fullName} as ${formData.role.toUpperCase()}.`);
      
      // Reset input structures
      setFormData({ fullName: '', assignedId: '', role: 'student', temporaryPassword: '' });
      fetchUsersRegistry(); // Refresh local list state directly from Neon
      setTimeout(() => setSuccessNotification(''), 5000);
    } catch (err) {
      console.error('Failed to commit profile generation pipeline:', err);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Revoke all infrastructure access tokens for ${name}?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccessNotification(`Access profile configuration purged for ${name}.`);
        fetchUsersRegistry(); // Refresh live view layout tracking data
        setTimeout(() => setSuccessNotification(''), 4000);
      } else {
        const errData = await response.json();
        alert(errData.error || 'Identity deletion request dropped.');
      }
    } catch (err) {
      console.error('Credential revocation runtime crash:', err);
    }
  };

  // Safe mapping arrays filtering from actual database rows (id_number instead of assignedId)
  const filteredUsers = activeUsers.filter(user => {
    const matchesSearch = (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (user.id_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Admin Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <Link to="/portal" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0c2340] mb-2 uppercase tracking-wider transition-colors">
              <ArrowLeft size={14} /> Exit Admin Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500 text-white rounded-md"><ShieldAlert size={18} /></span>
              <h1 className="text-2xl font-black text-[#0c2340]">Central Identity Provisioning Desk</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-800 text-xs shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Secure Session</span>
              <span className="font-mono text-amber-400 font-bold">Admin: Master_Terminal_01</span>
            </div>
          </div>
        </div>

        {/* Success Trigger Notification Banner */}
        {successNotification && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2.5 shadow-sm">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            {successNotification}
          </div>
        )}

        {/* Dashboard Split Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: SECURE PROVISIONING SIGNUP FORM */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="mb-6">
              <h2 className="text-sm font-black uppercase text-[#0c2340] tracking-wider flex items-center gap-1.5">
                <UserPlus size={16} className="text-amber-500" /> Enroll New Campus User
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Provision a secured digital database ledger block for internal administrators, educational faculty teachers, or standard assigned students.
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Full Legal Name</label>
                <input 
                  type="text" required placeholder="e.g., Limbani Phiri"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">System Assigned ID</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400"><Fingerprint size={14} /></span>
                    <input 
                      type="text" required placeholder="CSS/2026/XXXX"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-mono tracking-wider uppercase transition-all"
                      value={formData.assignedId}
                      onChange={(e) => setFormData({ ...formData, assignedId: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">System Access Role</label>
                  <select
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-bold transition-all"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="student">Student / Parent Tier</option>
                    <option value="teacher">Faculty Teacher</option>
                    <option value="bursar">Financial Bursar</option>
                    <option value="super-admin">System Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Temporary Access Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400"><Key size={14} /></span>
                  <input 
                    type="text" required placeholder="Set default login phrase"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-mono transition-all"
                    value={formData.temporaryPassword}
                    onChange={(e) => setFormData({ ...formData, temporaryPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0c2340] text-white font-black text-xs py-3.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
              >
                Deploy Profile Authorization Token <UserPlus size={15} />
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: ACTIVE ACCOUNTS SECURITY LIST REGISTRY */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Search, Filter Tools */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase text-[#0c2340] tracking-wider flex items-center gap-1.5 shrink-0">
                <Users size={16} className="text-slate-400" /> Active Registry ({filteredUsers.length})
              </h3>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-48">
                  <span className="absolute left-2.5 top-2.5 text-slate-400"><Search size={14} /></span>
                  <input
                    type="text" placeholder="Search ID or name..."
                    className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:border-amber-500 text-slate-800 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2 py-2 focus:outline-none text-slate-700 font-bold"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="bursar">Bursars</option>
                  <option value="super-admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Directory Data Matrix Cards */}
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-amber-500" size={24} />
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Querying Cloud Registry Profiles...</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    No accounts matching current security lookup filters.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4 group hover:bg-white hover:border-amber-500/40 transition-all">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{user.full_name}</h4>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                            user.role === 'super-admin' ? 'bg-rose-50 text-rose-600 border border-rose-200/50' :
                            user.role === 'teacher' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/50' :
                            user.role === 'bursar' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                            'bg-slate-200/70 text-slate-700'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                          ID: {user.id_number}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline text-[10px] text-slate-400">
                          Enrolled: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'System Base'}
                        </span>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.full_name)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Revoke Credentials"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
