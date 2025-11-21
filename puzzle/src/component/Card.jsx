import React from "react";
import { Sparkles } from "lucide-react";

export default function Card({ isFlipped, isMatched, src, onClick }) {
  const isEmoji = !src.startsWith("http");

  return (
    <div
      className="
        relative w-24 h-24 cursor-pointer 
        perspective
      "
      onClick={onClick}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-500 
          preserve-3d rounded-xl shadow-lg
          ${isFlipped || isMatched ? "rotate-y-180" : ""}
          ${isMatched ? "ring-4 ring-green-400 shadow-green-400/50" : ""}
        `}
      >

        {/* ---- FRONT ---- */}
        <div
          className="
            absolute inset-0 w-full h-full 
            backface-hidden rounded-xl 
            bg-gradient-to-br from-indigo-600 to-violet-900 
            border border-indigo-300/40 flex items-center justify-center
          "
        >
          <Sparkles className="w-6 h-6 text-indigo-200" />
        </div>

        {/* ---- BACK ---- */}
        <div
          className="
            absolute inset-0 w-full h-full 
            rotate-y-180 backface-hidden 
            rounded-xl overflow-hidden 
            bg-white border border-indigo-200
            flex items-center justify-center
          "
        >
          {isEmoji ? (
            <span className="text-4xl select-none">{src}</span>
          ) : (
            <img
              src={src}
              alt="card"
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
