import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export default function HeroSlider({ images = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-black">
      {images.map((imgUrl, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-transform duration-1000 ease-in-out bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(12, 35, 64, 0.75), rgba(12, 35, 64, 0.85)), url(${imgUrl})`,
            transform: `translateX(${(index - currentSlide) * 100}%)`
          }}
        />
      ))}
      
      {/* Overlay Text content (MUBAS Style Context Center Alignment) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-white font-extrabold text-3xl md:text-5xl lg:text-6xl max-w-4xl tracking-tight leading-tight">
          Welcome to Chayamba Secondary School
        </h1>
        <p className="text-amber-400 font-medium tracking-widest uppercase text-xs md:text-sm mt-4">
          Where Knowledge Meets Opportunity & Character
        </p>
        <p className="text-slate-300 max-w-2xl text-sm md:text-base mt-4 hidden sm:block">
          Equipping vibrant young learners in Malawi with future-proof skills, high moral discipline, and academic brilliance.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a href="#admissions" className="bg-amber-500 text-[#0c2340] px-6 py-3 rounded font-bold shadow-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
            Apply For Admission <ChevronRight size={16} />
          </a>
          <a href="#about" className="border-2 border-white text-white px-6 py-3 rounded font-bold hover:bg-white hover:text-[#0c2340] transition-all text-sm uppercase tracking-wider">
            Explore Campus Life
          </a>
        </div>
      </div>

      {/* Navigation Bullets */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-amber-500' : 'w-2.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
