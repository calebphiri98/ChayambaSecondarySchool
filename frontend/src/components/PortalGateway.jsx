import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, User, Eye, EyeOff, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import API_URL from '../config/api';

export default function PortalGateway() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ idNumber: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setErrorMessage('');
    setSuccessMessage('');
  }, [activeTab]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!formData.idNumber || !formData.password) {
      setErrorMessage("Please fill in all security clearance credentials.");
      return;
    }

    try {
      setLoading(true);
      const selectedRole = activeTab === 'staff' ? 'staff' : 'student';

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_number: formData.idNumber.toUpperCase(), // Match backend column name
          password: formData.password,
          role: selectedRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Identity credentials mismatch.');
      }

      // Redirect based on role
      if (data.user.role === 'staff') {
        navigate("/admin/dashboard");
      } else {
        navigate("/studentportal");
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-[85vh] py-12 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0c2340] mb-6 uppercase tracking-wider transition-colors">
          <ArrowLeft size={14} /> Back to homepage
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 text-[#0c2340] font-black text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-sm border-2 border-white">
            CH
          </div>
          <h1 className="text-xl font-black text-[#0c2340] tracking-wide mt-3 uppercase">Chayamba Portal Network</h1>
          <p className="text-xs text-slate-500 mt-1">Institutional Academic Management Gateway</p>
        </div>

        <div className="bg-slate-200 p-1 rounded-xl grid grid-cols-2 gap-1 mb-5 border border-slate-300/40">
          <button
            type="button"
            onClick={() => { setActiveTab('student'); setErrorMessage(''); }}
            className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'student' ? 'bg-[#0c2340] text-white shadow-sm' : 'text-slate-600 hover:text-[#0c2340]'
            }`}
          >
            Student & Parent
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('staff'); setErrorMessage(''); }}
            className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'staff' ? 'bg-[#0c2340] text-white shadow-sm' : 'text-slate-600 hover:text-[#0c2340]'
            }`}
          >
            Staff Desk
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-base font-bold text-[#0c2340]">
              {activeTab === 'student' ? 'Access Academic Records' : 'Secure Staff Terminal'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {activeTab === 'student' 
                ? 'Enter your MANEB Student Index ID prefix or registered family verification key code number to load termly report charts.' 
                : 'Authorized personnel access only. Grade sheets uploads and syllabus tracking inputs require registered central directory tokens.'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg text-xs flex items-start gap-2 leading-relaxed">
              <Lock size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div><span className="font-bold">System Error:</span> {errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                {activeTab === 'student' ? 'Student Registration / Index ID' : 'Employment Number'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-400"><User size={16} /></span>
                <input 
                  type="text" required 
                  placeholder={activeTab === 'student' ? 'e.g., CSS/2026/0492' : 'e.g., TS/CH/9942'}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3.5 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Security Access Token</label>
                <a href="#reset" onClick={(e) => { e.preventDefault(); alert("Contact Chayamba Secretariat Desk for reset."); }} className="text-[10px] font-bold text-amber-600 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-400"><Lock size={16} /></span>
                <input 
                  type={showPassword ? "text" : "password"} required 
                  placeholder="••••••••••••"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 py-3.5 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-mono tracking-widest transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#0c2340] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-[#0c2340] font-black text-xs py-3.5 rounded-lg uppercase tracking-wider hover:bg-amber-400 shadow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? 'Verifying Reference Key...' : 'Authorize System Access'} <ShieldCheck size={16} />
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-500 leading-normal flex items-center justify-center gap-1.5">
          <HelpCircle size={13} className="text-slate-400" /> 
          Need registration credentials? Contact the Registrar support unit.
        </div>
      </div>
    </div>
  );
}
