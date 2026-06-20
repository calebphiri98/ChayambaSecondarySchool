import React, { useState, useEffect } from 'react';
import { Send, HelpCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ParentQueryForm() {
  useEffect(() => {
    window.scrollTo(0, 0); // Window auto-reset position on page launch
  }, []);

  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    studentClass: 'Form 1',
    contactMethod: '',
    category: 'General Inquiry',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting query payload package:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 6000);
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Return Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0c2340] mb-6 uppercase tracking-wider transition-colors">
          <ArrowLeft size={14} /> Back to main home
        </Link>

        {/* Header Block */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block">Parent & Guardian Desk</span>
          <h2 className="text-3xl font-black text-[#0c2340] mt-1">Submit an Official Inquiry</h2>
          <p className="text-slate-600 text-xs md:text-sm max-w-xl mx-auto mt-2">
            Direct your query securely to the responsible administrative sector. All tickets are vetted and acknowledged directly via text message.
          </p>
        </div>

        {/* Feedback Success banner */}
        {isSubmitted && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs md:text-sm flex items-center gap-3">
            <CheckCircle className="text-emerald-500 shrink-0" size={20} />
            <div>
              <span className="font-bold">Transmission Complete!</span> Your ticket statement has been securely logged on our server database index.
            </div>
          </div>
        )}

        {/* Card Form Wrapper */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Parent / Guardian Full Name</label>
                <input 
                  type="text" required placeholder="e.g., John Phiri"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 transition-all"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Contact Phone / Email</label>
                <input 
                  type="text" required placeholder="e.g., +265 888 12 34 56"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 transition-all"
                  value={formData.contactMethod}
                  onChange={(e) => setFormData({...formData, contactMethod: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Registered Student Full Name</label>
                <input 
                  type="text" required placeholder="e.g., Brenda Phiri"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 transition-all"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Student Current Form Class</label>
                <select 
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 transition-all"
                  value={formData.studentClass}
                  onChange={(e) => setFormData({...formData, studentClass: e.target.value})}
                >
                  <option value="Form 1">Form 1</option>
                  <option value="Form 2">Form 2</option>
                  <option value="Form 3">Form 3</option>
                  <option value="Form 4">Form 4</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Routing Target (Responsible Department)</label>
              <select 
                className="w-full text-sm bg-slate-50 border border-amber-500 rounded-lg px-4 py-3 focus:outline-none text-slate-800 font-semibold"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="School Fees & Finance">School Fees Accounts Office (Bursar)</option>
                <option value="Academic Performance">Report Cards & Exam Results (Registry Desk)</option>
                <option value="Discipline & Boarding">Boarding Facilities & Student Welfare (Dean)</option>
                <option value="General Inquiry">General School Secretariat Office</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Query Statement</label>
              <textarea 
                rows="5" required placeholder="State your information requests, clear enough to facilitate rapid tracking..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 transition-all"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                className="w-full sm:w-auto bg-amber-500 text-[#0c2340] font-black px-6 py-3.5 rounded-lg hover:bg-amber-400 transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                File Institutional Query <Send size={14} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}