
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import { LayoutDashboard, Newspaper, Image, MessageSquare, Users, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import AdminOverview from '../components/admin/AdminOverview';
import AdminNews from '../components/admin/AdminNews';
import AdminGallery from '../components/admin/AdminGallery';
import AdminQueries from '../components/admin/AdminQueries';
import AdminUsers from '../components/admin/AdminUsers';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentTab, setCurrentTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const [newsDb, setNewsDb] = useState([]);
  const [galleryDb, setGalleryDb] = useState([]);
  const [parentQueriesDb, setParentQueriesDb] = useState([]);
  const [usersDb, setUsersDb] = useState([]);

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
          fetch(`${API_URL}/api/users`),
        ]);
        if (newsRes.ok) setNewsDb(await newsRes.json());
        if (galleryRes.ok) setGalleryDb(await galleryRes.json());
        if (queriesRes.ok) setParentQueriesDb(await queriesRes.json());
        if (usersRes.ok) setUsersDb(await usersRes.json());
      } else {
        const response = await fetch(`${API_URL}/api/${currentTab}`);
        if (response.ok) {
          const data = await response.json();
          if (currentTab === 'news') setNewsDb(Array.isArray(data) ? data : []);
          if (currentTab === 'gallery') setGalleryDb(Array.isArray(data) ? data : []);
          if (currentTab === 'queries') setParentQueriesDb(Array.isArray(data) ? data : []);
          if (currentTab === 'users') setUsersDb(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error("Database error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (endpoint, id, stateUpdater, statePool) => {
    if (!window.confirm("Are you sure you want to scrub this entry?")) return;
    try {
      const response = await fetch(`${API_URL}/api/${endpoint}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        stateUpdater(statePool.filter(item => item.id !== id));
      } else {
        alert("Delete permission denied.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/portal', { replace: true });
  };

  const NAV_ITEMS = [
    { tab: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { tab: 'news', label: 'News & Bulletins', icon: <Newspaper size={16} /> },
    { tab: 'gallery', label: 'Media Gallery', icon: <Image size={16} /> },
    { tab: 'queries', label: 'Parent Desk Inbox', icon: <MessageSquare size={16} /> },
    { tab: 'users', label: 'User Controls', icon: <Users size={16} /> },
  ];

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-[#0c2340] text-slate-300 shrink-0">
        <div className="p-6 border-b border-slate-800 bg-[#091b33]">
          <div className="text-amber-400 font-black text-sm uppercase">Chayamba CMS</div>
          {/* Logged-in user display */}
          {user && (
            <div className="mt-2">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest">Logged in as</p>
              <p className="text-white text-xs font-bold truncate">{user.full_name}</p>
            </div>
          )}
        </div>

        <nav className="p-4 flex flex-row lg:flex-col gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase transition-all w-full ${
                currentTab === tab ? 'bg-amber-500 text-[#0c2340]' : 'hover:bg-slate-800'
              }`}
            >
              {icon} {label}
            </button>
          ))}

          {/* Logout button at bottom of nav */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase transition-all w-full mt-auto text-rose-400 hover:bg-rose-900/30 hover:text-rose-300 lg:mt-4"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative">
        {isLoading && (
          <div className="absolute top-4 right-8 bg-amber-500 text-[#0c2340] px-3 py-1 rounded text-[10px] font-black animate-pulse">
            Syncing...
          </div>
        )}

        {currentTab === 'overview' && <AdminOverview newsDb={newsDb} galleryDb={galleryDb} parentQueriesDb={parentQueriesDb} usersDb={usersDb} />}
        {currentTab === 'news' && <AdminNews newsDb={newsDb} setNewsDb={setNewsDb} onDelete={(id) => handleDeleteItem('news', id, setNewsDb, newsDb)} />}
        {currentTab === 'gallery' && <AdminGallery galleryDb={galleryDb} setGalleryDb={setGalleryDb} onDelete={(id) => handleDeleteItem('gallery', id, setGalleryDb, galleryDb)} />}
        {currentTab === 'queries' && <AdminQueries parentQueriesDb={parentQueriesDb} setParentQueriesDb={setParentQueriesDb} onDelete={(id) => handleDeleteItem('queries', id, setParentQueriesDb, parentQueriesDb)} />}
        {currentTab === 'users' && <AdminUsers usersDb={usersDb} setUsersDb={setUsersDb} onDelete={(id) => handleDeleteItem('users', id, setUsersDb, usersDb)} />}
      </main>
    </div>
  );
}
