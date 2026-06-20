import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Bookmark, Loader2 } from 'lucide-react';
import API_URL from '../config/api'; // Adjust this relative path to point exactly to your file

export default function NewsArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0); // Always snap display viewport back to top on entry
    
    const fetchArticleDetails = async () => {
      try {
        setLoading(true);
        // Using your centralized API_URL variable dynamically
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) throw new Error('Network cluster response mismatch');
        
        const newsData = await response.json();
        
        // Find corresponding article model dynamically using flexible string/int comparison
        const foundArticle = newsData.find(item => String(item.id) === String(id));
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to resolve dynamic article context payload:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-amber-500" size={32} />
        <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">Retrieving Article Records...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-[#0c2340]">Article Record Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">The posting reference may have been updated or moved from the relational array storage.</p>
        <Link to="/" className="mt-6 inline-block bg-amber-500 text-[#0c2340] px-4 py-2 rounded text-xs font-bold uppercase tracking-wider">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-slate-50 min-h-[80vh] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link Nav Option */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0c2340] mb-6 uppercase tracking-wider transition-colors">
          <ArrowLeft size={14} /> Back to News Index
        </Link>

        {/* Category Badge Layout */}
        <span className="inline-block bg-[#0c2340] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded mb-4">
          {article.category}
        </span>

        {/* Article Headline Title */}
        <h1 className="text-2xl md:text-4xl font-black text-[#0c2340] leading-tight mb-4">
          {article.title}
        </h1>

        {/* Metadata Details strip */}
        <div className="flex items-center gap-6 text-slate-400 text-xs border-b border-slate-200 pb-4 mb-6">
          <span className="flex items-center gap-1">
            <Calendar size={13} /> {article.date_string || 'Recent Update'}
          </span>
          <span className="flex items-center gap-1">
            <User size={13} /> Posted by: {article.author || 'Administration Office'}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark size={13} /> Official Release
          </span>
        </div>

        {/* Featured Image Frame */}
        {article.image && (
          <div className="w-full h-64 md:h-[400px] overflow-hidden rounded-2xl shadow-sm border border-slate-200 mb-8">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Detailed Premium Content Typography */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm">
          <p className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line font-serif">
            {article.content}
          </p>
          
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400 font-sans">
              Verify administrative publications with the Secretariat registry offices.
            </span>
            <Link to="/" className="text-xs font-bold text-[#0c2340] hover:text-amber-600 transition-colors uppercase tracking-wider">
              Browse More Press Releases
            </Link>
          </div>
        </div>

      </div>
    </article>
  );
}
