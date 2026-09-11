import React from 'react';

export const Header = () => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">
          mergejil.mn
        </div>
      </div>
      <nav>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm">
          profile
        </button>
        <button className="text-gray-600 hover:bg-white px-4 py-2 rounded-lg transition">
          mergejil
        </button>
        <button className="text-gray-600 hover:bg-white px-4 py-2 rounded-lg transition">
          bolovsrol
        </button>
        <button className="text-gray-600 hover:bg-white px-4 py-2 rounded-lg transition">
          raodmap
        </button>
      </nav>
      <div className="flex items-center space-x-3 text-sm">
        <span className="bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-full">
          370xp
        </span>
        <button className="text-gray-500 hover:text-gray-700">Share</button>
        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
          Tuluw
        </button>
      </div>
    </header>
  );
};
