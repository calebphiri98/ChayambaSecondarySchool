import React, { useState } from 'react';
import API_URL from '../../config/api';
import { Upload, Trash2 } from 'lucide-react';

export default function AdminGallery({ galleryDb, setGalleryDb, onDelete }) {
  const [galleryForm, setGalleryForm] = useState({ caption: '', category: 'Academics', url: '' });
  const [dragActive, setDragActive] = useState(false);

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert("Invalid asset file. Please select an image.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setGalleryForm(prev => ({ ...prev, url: reader.result }));
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

  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.url) {
      alert("Please provide an image.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: galleryForm.caption || '',
          category: galleryForm.category,
          url: galleryForm.url,
        })
      });
      if (response.ok) {
        const created = await response.json();
        setGalleryDb([created, ...galleryDb]);
        setGalleryForm({ caption: '', category: 'Academics', url: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* UPLOAD FORM */}
      <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 flex items-center gap-1.5">
          <Upload size={15} /> Upload Photo
        </h2>
        <form onSubmit={handleAddGallery} className="space-y-4">
          <div
            onDragEnter={(e) => handleDrag(e, true)}
            onDragOver={(e) => handleDrag(e, true)}
            onDragLeave={(e) => handleDrag(e, false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all ${dragActive ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'}`}
          >
            {galleryForm.url ? (
              <div className="flex flex-col items-center gap-2">
                <img src={galleryForm.url} alt="Preview" className="w-full h-40 object-cover rounded border border-slate-200" />
                <button
                  type="button"
                  onClick={() => setGalleryForm({ ...galleryForm, url: '' })}
                  className="text-[10px] text-rose-500 hover:underline font-bold"
                >
                  Clear & Re-select
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block py-4">
                <Upload size={22} className="mx-auto text-slate-400 mb-2" />
                <span className="block text-[11px] text-slate-600 font-medium">
                  Drag & drop or <span className="text-[#0c2340] font-bold underline">browse files</span>
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => processImageFile(e.target.files[0])} />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={!galleryForm.url}
            className="w-full bg-[#0c2340] text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 transition-colors disabled:opacity-40"
          >
            Add to Gallery
          </button>
        </form>
      </div>

      {/* PHOTO GRID — photos only, delete on hover */}
      <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4">
          Gallery ({galleryDb.length} photos)
        </h2>
        {galleryDb.length === 0 ? (
          <div className="h-40 flex items-center justify-center border border-dashed border-slate-200 rounded-lg">
            <p className="text-xs text-slate-400">No photos uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryDb.map(g => (
              <div key={g.id} className="group relative rounded-lg overflow-hidden aspect-square bg-slate-100">
                <img src={g.url} alt="" className="w-full h-full object-cover" />
                {/* Delete button on hover only */}
                <button
                  onClick={() => onDelete(g.id)}
                  className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// import React, { useState } from 'react';
// import API_URL from '../../config/api';
// import { Upload, Trash2 } from 'lucide-react';

// export default function AdminGallery({ galleryDb, setGalleryDb, onDelete }) {
//   const [galleryForm, setGalleryForm] = useState({ caption: '', category: 'Academics', url: '' });
//   const [dragActive, setDragActive] = useState(false);

//   const processImageFile = (file) => {
//     if (!file || !file.type.startsWith('image/')) {
//       alert("Invalid asset file standard. Please select an image.");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onloadend = () => setGalleryForm(prev => ({ ...prev, url: reader.result }));
//     reader.readAsDataURL(file);
//   };

//   const handleDrag = (e, active) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(active);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files?.[0]) processImageFile(e.dataTransfer.files[0]);
//   };

//   const handleAddGallery = async (e) => {
//     e.preventDefault();
//     if (!galleryForm.caption || !galleryForm.url) {
//       alert("Please enter a caption and provide or drop an image asset.");
//       return;
//     }
//     try {
//       const response = await fetch(`${API_URL}/api/gallery`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(galleryForm)
//       });
//       if (response.ok) {
//         const created = await response.json();
//         setGalleryDb([created, ...galleryDb]);
//         setGalleryForm({ caption: '', category: 'Academics', url: '' });
//         alert("Database Commit Success: Asset pinned to live storage cluster.");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

//       {/* FORM */}
//       <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
//         <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4 flex items-center gap-1.5">
//           <Upload size={15} /> Upload Gallery Photo
//         </h2>
//         <form onSubmit={handleAddGallery} className="space-y-4">
//           <div>
//             <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Caption</label>
//             <input type="text" required placeholder="e.g., Main Campus Science block" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={galleryForm.caption} onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })} />
//           </div>
//           <div>
//             <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Album Category</label>
//             <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none" value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}>
//               <option value="Academics">Academics & Labs</option>
//               <option value="Infrastructure">Infrastructure Blocks</option>
//               <option value="Sports">Athletics & Events</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Media File</label>
//             <div
//               onDragEnter={(e) => handleDrag(e, true)}
//               onDragOver={(e) => handleDrag(e, true)}
//               onDragLeave={(e) => handleDrag(e, false)}
//               onDrop={handleDrop}
//               className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all ${dragActive ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'}`}
//             >
//               {galleryForm.url ? (
//                 <div className="flex items-center gap-3 text-left">
//                   <img src={galleryForm.url} alt="Queued" className="w-14 h-14 object-cover rounded border border-slate-300 shrink-0 bg-white" />
//                   <div className="min-w-0 flex-1">
//                     <p className="text-[11px] font-bold text-emerald-600">✓ File mapped successfully</p>
//                     <button type="button" onClick={() => setGalleryForm({ ...galleryForm, url: '' })} className="text-[10px] text-rose-500 hover:underline font-bold mt-0.5">Clear Asset</button>
//                   </div>
//                 </div>
//               ) : (
//                 <label className="cursor-pointer block">
//                   <Upload size={18} className="mx-auto text-slate-400 mb-1" />
//                   <span className="block text-[11px] text-slate-600 font-medium">Drag & drop or <span className="text-[#0c2340] font-bold underline">browse files</span></span>
//                   <input type="file" accept="image/*" className="hidden" onChange={(e) => processImageFile(e.target.files[0])} />
//                 </label>
//               )}
//             </div>
//           </div>
//           <button type="submit" className="w-full bg-[#0c2340] text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider hover:bg-slate-800 transition-colors">Commit Asset To Live Storage</button>
//         </form>
//       </div>

//       {/* GRID */}
//       <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
//         <h2 className="text-xs font-black uppercase text-[#0c2340] tracking-wider mb-4">Gallery Registry Feed</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//           {galleryDb.map(g => (
//             <div key={g.id} className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
//               <img src={g.url} alt={g.caption} className="w-full h-full object-cover" />
//               <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between items-start text-white">
//                 <span className="bg-amber-500 text-[#0c2340] text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded">{g.category}</span>
//                 <div className="w-full flex justify-between items-end gap-2">
//                   <p className="text-[10px] line-clamp-2 leading-tight font-medium">{g.caption}</p>
//                   <button onClick={() => onDelete(g.id)} className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded transition-colors shrink-0 shadow">
//                     <Trash2 size={12} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {galleryDb.length === 0 && <p className="text-xs text-slate-400 col-span-3 text-center py-6">No gallery items yet.</p>}
//         </div>
//       </div>
//     </div>
//   );
// }