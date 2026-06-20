import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';
import { 
  LayoutDashboard, Newspaper, Image, MessageSquare, 
  PlusCircle, Trash2, Upload, CheckCircle2, Globe, Loader2, Users 
} from 'lucide-react';

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  const [newsDb, setNewsDb] = useState([]);
  const [galleryDb, setGalleryDb] = useState([]);
  const [parentQueriesDb, setParentQueriesDb] = useState([]);
  const [usersDb, setUsersDb] = useState([]);

  const [newsForm, setNewsForm] = useState({ title: '', category: 'Campus', author: 'Admin', image: '', content: '' });
  const [galleryForm, setGalleryForm] = useState({ caption: '', category: 'Academics', url: '' });
  const [userForm, setUserForm] = useState({ id_number: '', password: '', role: 'student', full_name: '' });

  const [newsDragActive, setNewsDragActive] = useState(false);
  const [galleryDragActive, setGalleryDragActive] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTabClusterData();
  }, [currentTab]);

  const fetchTabClusterData = async () => {
    setIsLoading(true);
    try {
      if (currentTab === 'overview') {
        const [newsRes, galleryRes, queriesRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/api/news`),
          fetch(`${API_URL}/api/gallery`),
          fetch(`${API_URL}/api/queries`),
          fetch(`${API_URL}/api/users`)
        ]);
        if (newsRes.ok) setNewsDb(await newsRes.json());
        if (galleryRes.ok) setGalleryDb(await galleryRes.json());
        if (queriesRes.ok) setParentQueriesDb(await queriesRes.json());
        if (usersRes.ok) setUsersDb(await usersRes.json());
      } else {
        const response = await fetch(`${API_URL}/api/${currentTab}`);
        if (response.ok) {
          const data = await response.json();
          if (currentTab === 'news') setNewsDb(data);
          if (currentTab === 'gallery') setGalleryDb(data);
          if (currentTab === 'queries') setParentQueriesDb(data);
          if (currentTab === 'users') setUsersDb(data);
        }
      }
    } catch (err) {
      console.error("Database communication sequence intercepted: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const processImageFile = (file, targetForm) => {
    if (!file || !file.type.startsWith('image/')) {
      alert("Invalid asset file standard. Please select an image.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (targetForm === 'news') {
        setNewsForm(prev => ({ ...prev, image: reader.result }));
      } else if (targetForm === 'gallery') {
        setGalleryForm(prev => ({ ...prev, url: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e, setDragState) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragState(true);
    } else if (e.type === "dragleave") {
      setDragState(false);
    }
  };

  const handleDrop = (e, setDragState, targetForm) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], targetForm);
    }
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
      date_string: formattedDate, // Fixed attribute target identifier to align with database column structure
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
        const createdNode = await response.json();
        setNewsDb([createdNode, ...newsDb]);
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

  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.caption || !galleryForm.url) {
      alert("Please enter a caption and provide or drop an image asset.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm)
      });
      if (response.ok) {
        const createdAsset = await response.json();
        setGalleryDb([createdAsset, ...galleryDb]);
        setGalleryForm({ caption: '', category: 'Academics', url: '' });
        alert("Database Commit Success: Asset pinned to live storage cluster.");
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        const createdUser = await response.json();
        setUsersDb([createdUser, ...usersDb]);
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

  const handleDeleteItem = async (endpoint, id, stateUpdater, statePool) => {
    if (!window.confirm("Are you sure you want to scrub this entry?")) return;
    try {
      const response = await fetch(`${API_URL}/api/${endpoint}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        stateUpdater(statePool.filter(item => item.id !== id));
      } else {
        alert("Delete permission dropped by internal security context.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveQuery = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/queries/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setParentQueriesDb(parentQueriesDb.map(q => q.id === id ? { ...q, status: 'Reviewed' } : q));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col lg:flex-row">
      
      {/* SIDEBAR NAVIGATION CONTROL */}
      <aside className="w-full lg:w-64 bg-[#0c2340] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-[#091b33]">
          <div className="text-amber-400 font-black text-sm tracking-widest uppercase">Chayamba CMS</div>
          <div className="text-[10px] text-slate-400 font-medium">Control Management System</div>
        </div>

        <nav className="p-4 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible shrink-0 whitespace-nowrap lg:whitespace-normal">
          <button onClick={() => setCurrentTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all w-full ${currentTab === 'overview' ? 'bg-amber-500 text-[#0c2340]' : 'hover:bg-slate-800 text-slate-300'}`}><LayoutDashboard size={16} /> Overview</button>
          <button onClick={() => setCurrentTab('news')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all w-full ${currentTab === 'news' ? 'bg-amber-500 text-[#0c2340]' : 'hover:bg-slate-800 text-slate-300'}`}><Newspaper size={16} /> News & Bulletins</button>
          <button onClick={() => setCurrentTab('gallery')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all w-full ${currentTab === 'gallery' ? 'bg-amber-500 text-[#0c2340]' : 'hover:bg-slate-800 text-slate-300'}`}><Image size={16} /> Media Gallery</button>
          <button onClick={() => setCurrentTab('queries')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all w-full ${currentTab === 'queries' ? 'bg-amber-500 text-[#0c2340]' : 'hover:bg-slate-800 text-slate-300'}`}><MessageSquare size={16} /> Parent Desk Inbox</button>
          <button onClick={() => setCurrentTab('users')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all w-full ${currentTab === 'users' ? 'bg-amber-500 text-[#0c2340]' : 'hover:bg-slate-800 text-slate-300'}`}><Users size={16} /> User Controls</button>
        </nav>
      </aside>

      {/* CORE CONTENT RUNTIME PANELS */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative">
        
        {/* NETWORK SYNC LOADING STATE OVERLAY */}
        {isLoading && (
          <div className="absolute top-4 right-8 bg-amber-500 text-[#0c2340] px-3 py-1 rounded shadow text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 z-50 animate-pulse">
            <Loader2 size={12} className="animate-spin" /> Syncing Database Nodes...
          </div>
        )}

        {/* TAB 1: OVERVIEW SUMMARY TRACKER */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-black text-[#0c2340] uppercase">System Dashboard Overview</h1>
                <p className="text-slate-500 text-xs">Realtime structural node health monitoring diagnostics.</p>
              </div>
              <Link to="/" className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline">Live Site View <Globe size={14}/></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-blue-50 text-[#0c2340] rounded-lg"><Newspaper size={20}/></div>
                <div><span className="block text-[10px] text-slate-400 font-bold uppercase">News Articles</span><span className="text-lg font-black text-[#0c2340] font-mono">{newsDb.length} Logs</span></div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Image size={20}/></div>
                <div><span className="block text-[10px] text-slate-400 font-bold uppercase">Gallery Media</span><span className="text-lg font-black text-[#0c2340] font-mono">{galleryDb.length} Items</span></div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><MessageSquare size={20}/></div>
                <div><span className="block text-[10px] text-slate-400 font-bold uppercase">Parent Requests</span><span className="text-lg font-black text-[#0c2340] font-mono">{parentQueriesDb.length} Alerts</span></div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20}/></div>
                <div><span className="block text-[10px] text-slate-400 font-bold uppercase">Active Users</span><span className="text-lg font-black text-[#0c2340] font-mono">{usersDb.length} Nodes</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NEWS MANAGEMENT */}
        {currentTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 flex items-center gap-1.5"><PlusCircle size={15}/> Write Article / Notice</h2>
              <form onSubmit={handleAddNews} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Headline</label>
                  <input type="text" required placeholder="Article title..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={newsForm.title} onChange={e=>setNewsForm({...newsForm, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Classification Category</label>
                    <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={newsForm.category} onChange={e=>setNewsForm({...newsForm, category: e.target.value})}>
                      <option value="Campus">Campus News</option>
                      <option value="Announcement">Official Notice</option>
                      <option value="Events">School Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Publisher / Author</label>
                    <input type="text" placeholder="e.g., Admin, Principal" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={newsForm.author} onChange={e=>setNewsForm({...newsForm, author: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Header Image Asset Source</label>
                  <div 
                    onDragEnter={(e) => handleDrag(e, setNewsDragActive)}
                    onDragOver={(e) => handleDrag(e, setNewsDragActive)}
                    onDragLeave={(e) => handleDrag(e, setNewsDragActive)}
                    onDrop={(e) => handleDrop(e, setNewsDragActive, 'news')}
                    className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all ${newsDragActive ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'}`}
                  >
                    {newsForm.image ? (
                      <div className="flex items-center gap-3 text-left">
                        <img src={newsForm.image} alt="Queued" className="w-14 h-14 object-cover rounded border border-slate-300 shrink-0 bg-white" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-emerald-600 truncate">✓ Image file linked successfully</p>
                          <button type="button" onClick={() => setNewsForm({...newsForm, image: ''})} className="text-[10px] text-rose-500 hover:underline font-bold mt-0.5">Clear / Reset File</button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Upload size={18} className="mx-auto text-slate-400 mb-1" />
                        <span className="block text-[11px] text-slate-600 font-medium">Drag & drop image here or <span className="text-[#0c2340] font-bold underline">browse files</span></span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => processImageFile(e.target.files[0], 'news')} />
                      </label>
                    )}
                  </div>
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-2 text-[9px] text-slate-400 uppercase font-black tracking-widest">OR USE EXTERNAL LINK</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>
                  <input type="url" placeholder="Paste an image URL alternative directly..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none font-mono text-blue-600 underline" value={newsForm.image.startsWith('data:') ? '' : newsForm.image} onChange={e=>setNewsForm({...newsForm, image: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Body Content copy text</label>
                  <textarea rows={4} required placeholder="Type the full description data content copy text..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={newsForm.content} onChange={e=>setNewsForm({...newsForm, content: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-[#0c2340] text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 transition-colors">Publish to Database</button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4">Published Registry Feed (Live Database Feed)</h2>
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
                    <button onClick={() => handleDeleteItem('news', n.id, setNewsDb, newsDb)} className="text-slate-400 hover:text-rose-600 p-1 transition-colors"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA GALLERY HUD */}
        {currentTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 flex items-center gap-1.5"><Upload size={15}/> Upload Gallery Photo</h2>
              <form onSubmit={handleAddGallery} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Image Alternate Caption</label>
                  <input type="text" required placeholder="e.g., Main Campus Science block" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={galleryForm.caption} onChange={e=>setGalleryForm({...galleryForm, caption: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Album Category Classification</label>
                  <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={galleryForm.category} onChange={e=>setGalleryForm({...galleryForm, category: e.target.value})}>
                    <option value="Academics">Academics & Labs</option>
                    <option value="Infrastructure">Infrastructure blocks</option>
                    <option value="Sports">Athletics & Events</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Media File Upload Asset</label>
                  <div 
                    onDragEnter={(e) => handleDrag(e, setGalleryDragActive)}
                    onDragOver={(e) => handleDrag(e, setGalleryDragActive)}
                    onDragLeave={(e) => handleDrag(e, setGalleryDragActive)}
                    onDrop={(e) => handleDrop(e, setGalleryDragActive, 'gallery')}
                    className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all ${galleryDragActive ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'}`}
                  >
                    {galleryForm.url ? (
                      <div className="flex items-center gap-3 text-left">
                        <img src={galleryForm.url} alt="Queued Asset" className="w-14 h-14 object-cover rounded border border-slate-300 shrink-0 bg-white" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-emerald-600 truncate">✓ File mapped successfully</p>
                          <button type="button" onClick={() => setGalleryForm({...galleryForm, url: ''})} className="text-[10px] text-rose-500 hover:underline font-bold mt-0.5">Clear Asset</button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Upload size={18} className="mx-auto text-slate-400 mb-1" />
                        <span className="block text-[11px] text-slate-600 font-medium">Drag & drop image here or <span className="text-[#0c2340] font-bold underline">browse files</span></span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => processImageFile(e.target.files[0], 'gallery')} />
                      </label>
                    )}
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#0c2340] text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 transition-colors">Commit Asset To Live Storage</button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4">Gallery Registry Feed</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryDb.map(g => (
                  <div key={g.id} className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
                    <img src={g.url} alt={g.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between items-start text-white">
                      <span className="bg-amber-500 text-[#0c2340] text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded">{g.category}</span>
                      <div className="w-full flex justify-between items-end gap-2">
                        <p className="text-[10px] line-clamp-2 leading-tight font-medium">{g.caption}</p>
                        <button onClick={() => handleDeleteItem('gallery', g.id, setGalleryDb, galleryDb)} className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded transition-colors shrink-0 shadow"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PARENT DESK INBOX */}
        {currentTab === 'queries' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm max-w-4xl">
            <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4">Parent Communications Inbox Feed</h2>
            <div className="divide-y divide-slate-100">
              {parentQueriesDb.map(q => (
                <div key={q.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{q.subject}</span>
                      <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${q.status === 'Reviewed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{q.status || 'Pending'}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{q.message}</p>
                    <p className="text-[10px] text-slate-400 font-medium">From: <span className="text-slate-600 font-bold">{q.sender}</span></p>
                  </div>
                  {q.status !== 'Reviewed' && (
                    <button onClick={() => handleResolveQuery(q.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors self-start whitespace-nowrap text-[10px] uppercase tracking-wider shadow-sm"><CheckCircle2 size={12}/> Resolve</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: USER CONTROLS */}
        {currentTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 flex items-center gap-1.5"><PlusCircle size={15}/> Register System User</h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Full Identity Name</label>
                  <input type="text" required placeholder="Firstname Lastname" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={userForm.full_name} onChange={e=>setUserForm({...userForm, full_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">System Access ID Number</label>
                  <input type="text" required placeholder="Unique identification string..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono" value={userForm.id_number} onChange={e=>setUserForm({...userForm, id_number: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Account Secret Token/Password</label>
                  <input type="password" required placeholder="••••••••" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={userForm.password} onChange={e=>setUserForm({...userForm, password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Authorization Security Role</label>
                  <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-bold text-[#0c2340]" value={userForm.role} onChange={e=>setUserForm({...userForm, role: e.target.value})}>
                    <option value="student">Student Portal</option>
                    <option value="staff">Staff Desk</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-[#0c2340] text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 transition-colors">Sync Identity Array</button>
              </form>
            </div>

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
                          <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${u.role === 'staff' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{u.role}</span>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => handleDeleteItem('users', u.id, setUsersDb, usersDb)} className="text-slate-400 hover:text-rose-600 p-1 transition-colors"><Trash2 size={13}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
