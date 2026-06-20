import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ClipboardCheck, Copy, CheckCircle2, AlertCircle, FileText, Landmark, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdmissionsPage() {
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0); // Reset viewport scroll position on entry
  }, []);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 4000); // Clear confirmation message after 4s
  };

  const FEE_STRUCTURE = [
    { item: "Tuition Fees", boarder: "MK 25,000", day: "MK 10,000" },
    { item: "Boarding & Catering Levy", boarder: "MK 65,000", day: "N/A" },
    { item: "School Development Fund", boarder: "MK 15,000", day: "MK 15,000" },
    { item: "Textbook Deposit (Refundable)", boarder: "MK 5,000", day: "MK 5,000" },
    { item: "Medical & Welfare Insurance Contribution", boarder: "MK 5,000", day: "N/A" }
  ];

  return (
    <div className="bg-slate-50 min-h-[80vh] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Return Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0c2340] mb-6 uppercase tracking-wider transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Header Block */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block">Post-Selection Protocol</span>
          <h1 className="text-3xl font-black text-[#0c2340] mt-1">Admissions & Onboarding Guide</h1>
          <p className="text-slate-600 text-xs md:text-sm max-w-2xl mx-auto mt-2">
            Chayamba Secondary School welcomes all students selected by the Ministry of Education following the PSLCE (Standard 8) National Examinations. Follow the guidelines below to secure enrollment.
          </p>
        </div>

        {/* --- STEP BY STEP ONBOARDING TIMELINE --- */}
        <div className="mb-12">
          <h2 className="text-sm font-black uppercase text-[#0c2340] tracking-wider mb-6 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-amber-500" /> Intake Clearance Checklist
          </h2>
          <div className="space-y-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0c2340] font-black text-xs flex items-center justify-center shrink-0 border border-blue-100">1</div>
              <div>
                <h3 className="text-sm font-bold text-[#0c2340]">Collect Official Selection Letter</h3>
                <p className="text-slate-600 text-xs mt-1">
                  Visit the Chayamba Administrative Registry desk with your Primary School Leaving Certificate (PSLCE) notification printout and a valid identity pass to claim your official government assignment ledger sheet.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0c2340] font-black text-xs flex items-center justify-center shrink-0 border border-blue-100">2</div>
              <div>
                <h3 className="text-sm font-bold text-[#0c2340]">Fee Settlement via Bank Bank Slip</h3>
                <p className="text-slate-600 text-xs mt-1">
                  Deposit the total required terminal allocation balance matching your student class tier into the verified bank channels below. Retain the customer bank counter duplicate slip for processing. Cash payments are strictly prohibited at the school cashiers.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0c2340] font-black text-xs flex items-center justify-center shrink-0 border border-blue-100">3</div>
              <div>
                <h3 className="text-sm font-bold text-[#0c2340]">Verify Uniform & Personal Effects</h3>
                <p className="text-slate-600 text-xs mt-1">
                  Ensure all clothes and personal items closely follow the color coordinates outlined in the official handbook regulations. Boarding students must furnish items such as mattresses, heavy blankets, and metal lockers matching sizing thresholds.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* --- DYNAMIC FEE DETAILS AND COPYABLE BANK DATA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Fee Table (Left side) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-black uppercase text-[#0c2340] tracking-wider mb-4">Termly Fee Breakdown Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[#0c2340] font-bold">
                    <th className="py-3">Description Item</th>
                    <th className="py-3 text-right">Boarders</th>
                    <th className="py-3 text-right">Day Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {FEE_STRUCTURE.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 font-medium text-slate-800">{row.item}</td>
                      <td className="py-3 text-right font-semibold text-slate-700">{row.boarder}</td>
                      <td className="py-3 text-right text-slate-500">{row.day}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-200 text-[#0c2340] font-black text-sm bg-slate-50">
                    <td className="py-3 px-2">Total per Term</td>
                    <td className="py-3 pr-2 text-right text-amber-600">MK 115,000</td>
                    <td className="py-3 pr-2 text-right text-slate-700">MK 30,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Premium Copyable Bank Card (Right side) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Landmark size={14} /> Official Banking Repository
              </div>
              <h3 className="font-bold text-sm text-slate-200">Chayamba School Services</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">National Bank of Malawi (Kasungu Branch)</p>
              
              <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-lg mt-4 relative">
                <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Account Number</span>
                <span className="font-mono text-base font-black tracking-widest text-amber-400 block mt-1">100293847562</span>
                
                <button 
                  onClick={() => handleCopy("100293847562", "bank")}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                  title="Copy Account Number"
                >
                  {copiedText === "bank" ? <ClipboardCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-lg mt-3 relative">
                <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Airtel Money Billing Code</span>
                <span className="font-mono text-sm font-bold tracking-wider text-slate-200 block mt-1">Merchant Keyword: CHAYAMBA</span>
                
                <button 
                  onClick={() => handleCopy("CHAYAMBA", "airtel")}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                >
                  {copiedText === "airtel" ? <ClipboardCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {copiedText && (
              <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded text-[10px] flex items-center gap-1">
                <CheckCircle2 size={12} /> Text string successfully written to memory clipboard buffer.
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 leading-snug flex items-start gap-1.5">
              <AlertCircle size={12} className="shrink-0 text-amber-500" /> Duplicate teller paper copies must clearly reference the student name inside the text narration block field.
            </div>
          </div>

        </div>

        {/* --- PREMIUM DOWNLOADABLE PROSPECTUS & SCHOOL RULES SECTION --- */}
        <div className="bg-gradient-to-br from-[#0c2340] to-[#0a1e36] text-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 text-slate-800/10 translate-x-10 translate-y-10 scale-150 pointer-events-none">
            <FileText size={200} />
          </div>

          <div className="max-w-xl relative z-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Official Document Registry</span>
            <h2 className="text-xl md:text-2xl font-black mt-1">Prospectus & School Rules</h2>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Download the official institutional guidelines below to review our code of conduct, acceptable uniform colors and cuts, authorized visiting days, and complete policies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              
              {/* Asset Box 1 */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 group hover:border-amber-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0c2340] rounded-lg text-amber-400"><FileText size={20} /></div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">School Prospectus</h4>
                    <span className="text-[10px] text-slate-500 block">PDF Format • 2.4 MB</span>
                  </div>
                </div>
                {/* Clicking toggles anchor system downloads */}
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Downloading: Chayamba_Prospectus_Handbook.pdf'); }}
                  className="p-2 bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-[#0c2340] rounded-lg transition-colors"
                  title="Download File"
                >
                  <Download size={14} />
                </a>
              </div>

              {/* Asset Box 2 */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 group hover:border-amber-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0c2340] rounded-lg text-amber-400"><FileText size={20} /></div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">Rules & Regulations</h4>
                    <span className="text-[10px] text-slate-500 block">PDF Format • 1.1 MB</span>
                  </div>
                </div>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Downloading: Chayamba_School_Rules.pdf'); }}
                  className="p-2 bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-[#0c2340] rounded-lg transition-colors"
                  title="Download File"
                >
                  <Download size={14} />
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}