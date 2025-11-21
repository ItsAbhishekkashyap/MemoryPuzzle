import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Card({ isFlipped, isMatched, src, onClick }) {
  // Detect emoji (or any non-URL string) - Logic preserved
  const isEmoji = !src.startsWith("http"); 

  return (
    <div
      className={`
        relative w-full aspect-[3/4] cursor-pointer group perspective-1000
        ${isMatched ? 'pointer-events-none' : ''}
      `}
      onClick={onClick}
    >
      <div
        className={`
          w-full h-full transition-all duration-500 ease-out 
          [transform-style:preserve-3d] shadow-xl rounded-2xl
          ${isFlipped || isMatched ? '[transform:rotateY(180deg)]' : 'hover:-translate-y-2 hover:shadow-2xl'}
          ${isMatched ? 'shadow-green-400/50 ring-4 ring-green-400 animate-pulse' : ''}
        `}
      >
        {/* --- FRONT (Face Down) --- */}
        <div 
          className="
            absolute inset-0 w-full h-full 
            bg-gradient-to-br from-indigo-600 to-violet-900 
            rounded-2xl border-2 border-indigo-400/30
            flex items-center justify-center 
            [backface-visibility:hidden]
          "
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <Sparkles className="w-8 h-8 text-indigo-200 animate-pulse" />
        </div>

        {/* --- BACK (Face Up - Content) --- */}
        <div 
          className="
            absolute inset-0 w-full h-full 
            bg-white rounded-2xl overflow-hidden
            border-4 border-indigo-100
            flex items-center justify-center 
            [backface-visibility:hidden] [transform:rotateY(180deg)]
          "
        >
          {isEmoji ? (
            <span className="text-5xl sm:text-6xl filter drop-shadow-sm select-none transform transition-transform hover:scale-110">
              {src}
            </span>
          ) : (
            <div className="relative w-full h-full p-1">
               <img
                src={src}
                alt="card content"
                className="object-cover w-full h-full rounded-xl shadow-inner"
              />
            </div>
          )}
          
          {/* Shine effect overlay for the glass look */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
