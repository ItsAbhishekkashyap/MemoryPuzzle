import React, { useState } from "react";

export default function Card({ isFlipped, isMatched, src, onClick }) {
  // Determine content type
  const isEmoji = src.startsWith("http") || src.startsWith("/");

  return (
    <div
      className={`relative w-32 h-44 cursor-pointer group perspective-1000 ${
        isMatched ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={onClick}
    >
      <div
        className={`
          w-full h-full transition-all duration-500 
          [transform-style:preserve-3d] 
          ${isFlipped || isMatched ? "rotate-y-180" : ""}
        `}
      >
        {/* Card Back (The pattern visible when face down) */}
        <div className="absolute w-full h-full bg-indigo-600 rounded-xl shadow-md flex items-center justify-center [backface-visibility:hidden] border-2 border-indigo-400">
          <span className="text-4xl text-white opacity-50">?</span>
        </div>

        {/* Card Front (The content visible when flipped) */}
        <div
          className="
            absolute w-full h-full bg-white rounded-xl shadow-md 
            flex items-center justify-center overflow-hidden 
            [backface-visibility:hidden] [transform:rotateY(180deg)]
            border-2 border-gray-200
          "
        >
          {isEmoji ? (
            <span
              className="text-5xl select-none"
              role="img"
              aria-label="card content"
            >
              {src}
            </span>
          ) : (
            <img
              src={src}
              alt="Card Content"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
