import React, { useState } from 'react';
import API_URL from '../../config/api';
import { PlusCircle, Upload, Trash2 } from 'lucide-react';

export default function AdminNews({ newsDb, setNewsDb, onDelete }) {
  const [newsForm, setNewsForm] = useState({ title: '', category: 'Campus', author: 'Admin', image: '', content: '' });
  const [dragActive, setDragActive] = useState(false);

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert("Invalid asset file standard. Please select an image.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setNewsForm(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleDrag = (e, active) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processImageFile(e.dataTransfer.files[0]);
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) return;

    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', options).replace(/,/g, '');
    const fallbackImg = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600";

    const payload = {
      category: newsForm.category,
      title: newsForm.title,
      date_string: formattedDate,
      author: newsForm.author || "Staff Desk",
      content: newsForm.content,
      image: newsForm.image.trim() !== "" ? newsForm.image : fallbackImg
    };

    try {
      const response = await fetch(`${API_URL}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const created = await response.json();
        setNewsDb([created, ...newsDb]);
        setNewsForm({ title: '', category: 'Campus', author: 'Admin', image: '', content: '' });
        alert("Database Commit Success: New article posted to live data records.");
      } else {
        alert("Write operation rejected by security layer.");
      }
    } catch (err) {
      console.error(err);
      alert("Pipeline failure updating news clusters.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* FORM */}
      <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 flex items-center gap-1.5">
          <PlusCircle size={15} /> Write Article / Notice
        </h2>
        <form onSubmit={handleAddNews} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Headline</label>
            <input type="text" required placeholder="Article title..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Category</label>
              <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}>
                <option value="Campus">Campus News</option>
                <option value="Announcement">Official Notice</option>
                <option value="Events">School Event</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Author</label>
              <input type="text" placeholder="e.g., Admin, Principal" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={newsForm.author} onChange={e => setNewsForm({ ...newsForm, author: e.target.value })} />
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Header Image Asset</label>
            <div
              onDragEnter={(e) => handleDrag(e, true)}
              onDragOver={(e) => handleDrag(e, true)}
              onDragLeave={(e) => handleDrag(e, false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all ${dragActive ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'}`}
            >
              {newsForm.image ? (
                <div className="flex items-center gap-3 text-left">
                  <img src={newsForm.image} alt="Queued" className="w-14 h-14 object-cover rounded border border-slate-300 shrink-0 bg-white" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-emerald-600 truncate">✓ Image file linked successfully</p>
                    <button type="button" onClick={() => setNewsForm({ ...newsForm, image: '' })} className="text-[10px] text-rose-500 hover:underline font-bold mt-0.5">Clear / Reset File</button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload size={18} className="mx-auto text-slate-400 mb-1" />
                  <span className="block text-[11px] text-slate-600 font-medium">Drag & drop or <span className="text-[#0c2340] font-bold underline">browse files</span></span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => processImageFile(e.target.files[0])} />
                </label>
              )}
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-2 text-[9px] text-slate-400 uppercase font-black tracking-widest">OR USE EXTERNAL LINK</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            <input type="url" placeholder="Paste an image URL alternative..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none font-mono text-blue-600 underline" value={newsForm.image.startsWith('data:') ? '' : newsForm.image} onChange={e => setNewsForm({ ...newsForm, image: e.target.value })} />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Body Content</label>
            <textarea rows={4} required placeholder="Type the full article content..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={newsForm.content} onChange={e => setNewsForm({ ...newsForm, content: e.target.value })} />
          </div>

          <button type="submit" className="w-full bg-[#0c2340] text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 transition-colors">Publish to Database</button>
        </form>
      </div>

      {/* FEED */}
      <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4">Published Registry Feed</h2>
        <div className="space-y-3">
          {newsDb.map(n => (
            <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex gap-4 text-xs items-center justify-between">
              <div className="flex gap-3 items-center min-w-0">
                <img src={n.image} alt="Preview" className="w-12 h-12 object-cover rounded border border-slate-200 shrink-0 bg-slate-300" />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{n.title}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Category: <span className="text-[#0c2340] font-bold">{n.category}</span> • By: {n.author} • On: {n.date_string}
                  </p>
                </div>
              </div>
              <button onClick={() => onDelete(n.id)} className="text-slate-400 hover:text-rose-600 p-1 transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {newsDb.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No articles published yet.</p>}
        </div>
      </div>
    </div>
  );
}