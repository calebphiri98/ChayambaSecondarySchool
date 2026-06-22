import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider'; 
import PortalGateway from './components/PortalGateway';
import AdminDashboard from './pages/AdminDashboard';
import InfoSections from './components/InfoSections';
import NewsArticlePage from './components/NewsArticlePage';
import AdmissionsPage from './components/AdmissionsPage';
import ParentQueryForm from './components/ParentQueryForm';
import { ChevronRight, Calendar, User, Target, Eye, Loader2 } from 'lucide-react';
import API_URL from './config/api';

// fallback standard hero assets if database config handles slides differently
const DEFAULT_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200"
];

function HomePage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) throw new Error('Failed to resolve dynamic news array nodes');
        
        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error('Error synchronizing database news streams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <>
      {/* Handing down slider configurations */}
      <HeroSlider images={DEFAULT_HERO_IMAGES} />

      {/* --- MISSION, VISION, & ABOUT GRID --- */}
      <section id="about" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block">True Academic Excellence</span>
            <h4 className="text-2xl md:text-3xl font-black text-[#0c2340]">WORK TO EARN (TRAVAILLER POUR GAGNER)</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Chayamba Secondary School provides a robust environment where young minds flourish. We commit ourselves to holistic learning systems that emphasize both intellectual growth and practical problem-solving capabilities.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 text-[#0c2340] w-fit rounded-lg mb-4">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#0c2340] mb-2">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To foster intellectual curiosity, empower unique student talents, and deliver comprehensive value that contributes directly to the societal improvement of Malawi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-50 text-amber-600 w-fit rounded-lg mb-4">
                <Eye size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#0c2340] mb-2">Our Vision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To stand out undeniably as a flagship center of excellence for secondary education, producing highly skilled, innovative, and ethically grounded citizens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST NEWS & UPDATES --- */}
      <section id="news" className="bg-slate-100 py-16 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block">Stay Updated</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#0c2340]">Latest News & Announcements</h2>
            </div>
          </div>

          {loading ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 bg-white border border-dashed border-slate-200 rounded-xl">
              <Loader2 className="animate-spin text-amber-500" size={24} />
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Syncing Article Matrix...</span>
            </div>
          ) : news.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-200 rounded-xl p-4">
              <p className="text-sm font-bold text-[#0c2340]">No Recent Announcements</p>
              <p className="text-xs text-slate-400 mt-0.5">Use the admin gateway matrix to broadcast upcoming announcements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <article key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow border border-slate-200/60">
                  <div className="h-48 overflow-hidden relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 bg-[#0c2340] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-slate-400 text-xs mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {item.date_string || item.date}</span>
                        <span className="flex items-center gap-1"><User size={12} /> {item.author || 'Administration'}</span>
                      </div>
                      <Link to={`/news/${item.id}`} className="font-bold text-[#0c2340] text-base md:text-lg leading-snug line-clamp-2 hover:text-amber-600 transition-colors">
                        {item.title}
                      </Link>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <Link to={`/news/${item.id}`} className="text-xs font-bold text-amber-600 hover:text-[#0c2340] transition-colors flex items-center gap-1">
                        Read Details <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <InfoSections />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
        <Navbar />
        
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/parent-desk" element={<ParentQueryForm />} />
            <Route path="/news/:id" element={<NewsArticlePage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/portal" element={<PortalGateway />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* --- GLOBAL FOOTER --- */}
        <footer className="bg-[#08182b] text-white py-12 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-slate-400">
              © 2026 Chayamba Secondary School. All rights reserved. Redesigned with premium standards.
            </p>
            <div className="flex gap-6 text-slate-300">
              <a href="#privacy" className="hover:text-white">Privacy Policy</a>
              <a href="#terms" className="hover:text-white">Terms of Use</a>
              <Link to="/portal" className="hover:text-white">Portal Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}