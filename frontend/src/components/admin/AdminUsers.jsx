import React, { useState } from 'react';
import API_URL from '../../config/api';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function AdminUsers({ usersDb, setUsersDb, onDelete }) {
  const [userForm, setUserForm] = useState({
    full_name: '',
    password: '',
    role: 'student',
    // student-specific suffix parts
    studentYear: '',
    studentSerial: '',
    // staff-specific suffix
    staffSerial: '',
  });

  // Build the final id_number based on role
  const buildIdNumber = () => {
    if (userForm.role === 'staff') {
      return `CSS-STA-${userForm.staffSerial.trim()}`;
    } else {
      return `CSS/${userForm.studentYear.trim()}/${userForm.studentSerial.trim()}`;
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    const id_number = buildIdNumber();

    // Validate suffix fields are filled
    if (userForm.role === 'staff' && !userForm.staffSerial.trim()) {
      alert("Please enter the staff serial number (e.g. 001).");
      return;
    }
    if (userForm.role === 'student' && (!userForm.studentYear.trim() || !userForm.studentSerial.trim())) {
      alert("Please enter both the year and serial number for the student ID.");
      return;
    }
    if (!userForm.full_name || !userForm.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_number,
          password: userForm.password,
          role: userForm.role,
          full_name: userForm.full_name,
        }),
      });

      if (response.ok) {
        const created = await response.json();
        setUsersDb([created, ...usersDb]);
        setUserForm({
          full_name: '',
          password: '',
          role: 'student',
          studentYear: '',
          studentSerial: '',
          staffSerial: '',
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || 'Failed to register user. ID may already exist.');
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* FORM */}
      <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 flex items-center gap-1.5">
          <PlusCircle size={15} /> Register User
        </h2>

        <form onSubmit={handleAddUser} className="space-y-4" autoComplete="off">

          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Full Name</label>
            <input
              type="text" required autoComplete="off"
              placeholder="e.g. John Banda"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
              value={userForm.full_name}
              onChange={e => setUserForm({ ...userForm, full_name: e.target.value })}
            />
          </div>

          {/* Role selector — shown first so ID field updates accordingly */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Role</label>
            <select
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-bold text-[#0c2340]"
              value={userForm.role}
              onChange={e => setUserForm({ ...userForm, role: e.target.value, studentYear: '', studentSerial: '', staffSerial: '' })}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* ID Number — changes based on role */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
              {userForm.role === 'staff' ? 'Staff ID Number' : 'Student ID Number'}
            </label>

            {userForm.role === 'staff' ? (
              // Staff: CSS-STA-[serial]
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono font-black text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5 shrink-0">
                  CSS-STA-
                </span>
                <input
                  type="text" required
                  placeholder="001"
                  maxLength={6}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-500 font-mono font-bold text-[#0c2340]"
                  value={userForm.staffSerial}
                  onChange={e => setUserForm({ ...userForm, staffSerial: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            ) : (
              // Student: CSS/[year]/[serial]
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono font-black text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5 shrink-0">
                  CSS/
                </span>
                <input
                  type="text" required
                  placeholder="2026"
                  maxLength={4}
                  className="w-20 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-500 font-mono font-bold text-[#0c2340]"
                  value={userForm.studentYear}
                  onChange={e => setUserForm({ ...userForm, studentYear: e.target.value.replace(/\D/g, '') })}
                />
                <span className="text-slate-400 font-mono font-bold">/</span>
                <input
                  type="text" required
                  placeholder="0492"
                  maxLength={6}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-500 font-mono font-bold text-[#0c2340]"
                  value={userForm.studentSerial}
                  onChange={e => setUserForm({ ...userForm, studentSerial: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            )}

            {/* Live preview of the full ID */}
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
              Preview: <span className="text-amber-600 font-black">{buildIdNumber()}</span>
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Password</label>
            <input
              type="password" required autoComplete="new-password"
              placeholder="••••••••"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
              value={userForm.password}
              onChange={e => setUserForm({ ...userForm, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0c2340] text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Register User
          </button>
        </form>
      </div>

      {/* DIRECTORY TABLE */}
      <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4">
          Registered Users ({usersDb.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50">
                <th className="p-3">Full Name</th>
                <th className="p-3">ID Number</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
                  <td colSpan={4} className="p-4 text-center text-slate-400">No users registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}