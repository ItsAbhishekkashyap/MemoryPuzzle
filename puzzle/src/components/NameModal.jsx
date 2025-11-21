"use client"
import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';


export default function NameModal({ onConfirm }){
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Please enter your name to proceed.")
      return;
    }
    
    // Call the prop with the entered name
    onConfirm(name.trim());
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center">
          <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Welcome!</h2>
          <p className="text-indigo-100 text-sm">Please enter your details to continue.</p>
        </div>

        {/* Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                What should we call you?
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e)=> e.key === "Enter" && handleSubmit}
                placeholder="Enter your name..."
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  focus:ring-2 focus:outline-none transition-all
                  ${error 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50' 
                    : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
                  }
                `}
                autoFocus
              />
              {error && (
                <button type="button" onClick={handleSubmit} className='w-full py-2 bh-blue-600 rounded hover:bg-blue-700 transition'>Continue
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

