import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import API_URL from '../config/api'; // Dynamic routing controller link

export default function InfoSections() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampusGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/gallery`);
        if (!response.ok) throw new Error('Failed to capture gallery array nodes');
        
        const data = await response.json();
        setGallery(data);
      } catch (err) {
        console.error('Error synchronizing campus media layers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampusGallery();
  }, []);

  return (
    <>
      {/* --- CAMPUS GALLERY SECTION --- */}
      <section id="gallery" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block">Life at Chayamba</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0c2340] flex items-center gap-2">
            <ImageIcon size={28} className="text-[#0c2340]" /> Campus Gallery
          </h2>
          <p className="text-slate-500 text-xs mt-1">Snapshots of recent school events, sports highlights, and academic milestones.</p>
        </div>

        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            <Loader2 className="animate-spin text-amber-500" size={24} />
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Syncing Media Matrices...</span>
          </div>
        ) : gallery.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4">
            <p className="text-sm font-bold text-[#0c2340]">No Media Elements Found</p>
            <p className="text-xs text-slate-400 mt-0.5">Use the administrative panel matrix to push recent asset streams.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div key={item.id} className="group relative h-48 md:h-64 rounded-xl overflow-hidden bg-slate-200 shadow-sm border border-slate-100">
                <img 
                  src={item.url} 
                  alt={item.caption || "Campus media snapshot"} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/90 via-[#0c2340]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-bold text-xs md:text-sm tracking-wide">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- CONTACT US & LOCATION SECTION --- */}
      <section id="contact" className="bg-[#0c2340] text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">Get In Touch</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">Contact Administration</h2>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                Have questions about admissions, student records, or school events? Reach out directly through any of our channels or visit our campus administration offices in Kasungu.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-amber-400"><MapPin size={18} /></div>
                  <div>
                    <h4 className="font-bold text-sm">Our Location</h4>
                    <p className="text-xs text-slate-300">Kasungu Boma, Central Region, Malawi</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-amber-400"><Phone size={18} /></div>
                  <div>
                    <h4 className="font-bold text-sm">Phone Lines</h4>
                    <p className="text-xs text-slate-300">+265 (0) 1 253 442 / +265 (0) 888 312 988</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-amber-400"><Mail size={18} /></div>
                  <div>
                    <h4 className="font-bold text-sm">Email Address</h4>
                    <p className="text-xs text-slate-300">info@chayambasecondary.edu.mw</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-base font-bold text-amber-400 mb-2">Find Us on Google Maps</h3>
                <p className="text-xs text-slate-400 mb-4">Located along the main transit paths accessing central Kasungu town facilities.</p>
                
                <div className="w-full h-48 bg-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4 border border-slate-700/50">
                  <MapPin size={32} className="text-amber-500 animate-bounce mb-2" />
                  <span className="font-bold text-sm block text-slate-200">Chayamba Secondary School</span>
                  <span className="text-xs text-slate-400 block mt-0.5">Kasungu, Malawi</span>
                  
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-4 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#0c2340] rounded text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
                  >
                    Open Navigation Map <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-4 text-center lg:text-left">
                Official institutional correspondence must route directly through the Head Teacher's academic registrar desk.
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
