import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handles moving to internal sections seamlessly across different routes
  const handleSectionScroll = (sectionId) => {
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      // If away from the home app footprint, change route first then check for element
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      // If already on the landing app layer, scroll right away
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0c2340] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center font-bold text-xl text-[#0c2340]">
              C
            </div>
            <div>
              <span className="font-bold text-lg block tracking-wide">CHAYAMBA</span>
              <span className="text-xs text-slate-300 block -mt-1">Secondary School</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium uppercase tracking-wider">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <button 
              onClick={() => handleSectionScroll('about')} 
              className="hover:text-amber-400 transition-colors uppercase text-sm font-medium tracking-wider bg-transparent border-none cursor-pointer"
            >
              About Us
            </button>
            <Link to="/parent-desk" className="hover:text-amber-400 transition-colors">Parent Desk</Link>
            <Link to="/admissions" className="hover:text-amber-400 transition-colors">Admissions</Link>
            <button 
              onClick={() => handleSectionScroll('news')} 
              className="hover:text-amber-400 transition-colors uppercase text-sm font-medium tracking-wider bg-transparent border-none cursor-pointer"
            >
              News
            </button>
            <button 
              onClick={() => handleSectionScroll('gallery')} 
              className="hover:text-amber-400 transition-colors uppercase text-sm font-medium tracking-wider bg-transparent border-none cursor-pointer"
            >
              Gallery
            </button>
            <Link to="/portal" className="bg-amber-500 text-[#0c2340] px-4 py-2 rounded font-bold hover:bg-amber-400 transition-colors">Portal Login</Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 rounded-md hover:bg-slate-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1d35] border-t border-slate-700 px-4 pt-2 pb-6 space-y-2">
          <Link to="/" className="block py-2.5 px-3 rounded hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <button 
            onClick={() => handleSectionScroll('about')} 
            className="w-full text-left block py-2.5 px-3 rounded hover:bg-slate-800 text-white font-medium"
          >
            About Us
          </button>
          <Link to="/parent-desk" className="block py-2.5 px-3 rounded hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Parent Desk</Link>
          <Link to="/admissions" className="block py-2.5 px-3 rounded hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Admissions</Link>
          <button 
            onClick={() => handleSectionScroll('news')} 
            className="w-full text-left block py-2.5 px-3 rounded hover:bg-slate-800 text-white font-medium"
          >
            News & Events
          </button>
          <button 
            onClick={() => handleSectionScroll('gallery')} 
            className="w-full text-left block py-2.5 px-3 rounded hover:bg-slate-800 text-white font-medium"
          >
            Gallery
          </button>
          <Link to="/portal" className="block text-center bg-amber-500 text-[#0c2340] font-bold py-2.5 rounded mt-4" onClick={() => setIsMobileMenuOpen(false)}>Portal Login</Link>
        </div>
      )}
    </nav>
  );
}
