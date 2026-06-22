import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';
import { LayoutDashboard, Newspaper, Image, MessageSquare, Users, Globe, Loader2 } from 'lucide-react';

import AdminOverview from '../components/admin/AdminOverview';
import AdminNews from '../components/admin/AdminNews';
import AdminGallery from '../components/admin/AdminGallery';
import AdminQueries from '../components/admin/AdminQueries';
import AdminUsers from '../components/admin/AdminUsers';

export default function AdminDashboard() {
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

  const handleDeleteItem = async (endpoint, id, stateUpdater, statePool) => {
    if (!window.confirm("Are you sure you want to scrub this entry?")) return;
    try {
      const response = await fetch(`${API_URL}/api/${endpoint}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        stateUpdater(statePool.filter(item => item.id !== id));
      } else {
        alert("Delete permission dropped by internal security context.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const NAV_ITEMS = [
    { tab: 'overview',  label: 'Overview',          icon: <LayoutDashboard size={16} /> },
    { tab: 'news',      label: 'News & Bulletins',   icon: <Newspaper size={16} /> },
    { tab: 'gallery',   label: 'Media Gallery',      icon: <Image size={16} /> },
    { tab: 'queries',   label: 'Parent Desk Inbox',  icon: <MessageSquare size={16} /> },
    { tab: 'users',     label: 'User Controls',      icon: <Users size={16} /> },
  ];

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col lg:flex-row">

      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 bg-[#0c2340] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-[#091b33]">
          <div className="text-amber-400 font-black text-sm tracking-widest uppercase">Chayamba CMS</div>
          <div className="text-[10px] text-slate-400 font-medium">Control Management System</div>
        </div>
        <nav className="p-4 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible shrink-0 whitespace-nowrap lg:whitespace-normal">
          {NAV_ITEMS.map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all w-full ${
                currentTab === tab ? 'bg-amber-500 text-[#0c2340]' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative">

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="absolute top-4 right-8 bg-amber-500 text-[#0c2340] px-3 py-1 rounded shadow text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 z-50 animate-pulse">
            <Loader2 size={12} className="animate-spin" /> Syncing Database Nodes...
          </div>
        )}

        {currentTab === 'overview' && (
          <AdminOverview
            newsDb={newsDb}
            galleryDb={galleryDb}
            parentQueriesDb={parentQueriesDb}
            usersDb={usersDb}
          />
        )}

        {currentTab === 'news' && (
          <AdminNews
            newsDb={newsDb}
            setNewsDb={setNewsDb}
            onDelete={(id) => handleDeleteItem('news', id, setNewsDb, newsDb)}
          />
        )}

        {currentTab === 'gallery' && (
          <AdminGallery
            galleryDb={galleryDb}
            setGalleryDb={setGalleryDb}
            onDelete={(id) => handleDeleteItem('gallery', id, setGalleryDb, galleryDb)}
          />
        )}

        {currentTab === 'queries' && (
          <AdminQueries
            parentQueriesDb={parentQueriesDb}
            setParentQueriesDb={setParentQueriesDb}
            onDelete={(id) => handleDeleteItem('queries', id, setParentQueriesDb, parentQueriesDb)}
          />
        )}

        {currentTab === 'users' && (
          <AdminUsers
            usersDb={usersDb}
            setUsersDb={setUsersDb}
            onDelete={(id) => handleDeleteItem('users', id, setUsersDb, usersDb)}
          />
        )}

      </main>
    </div>
  );
}