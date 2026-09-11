import React from 'react';

export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-10 h-10 animate-spin rounded-full bg-gradient-to-tr from-[#1E488F] to-[#23497C] p-1">
        <div className="w-full h-full bg-white rounded-full"></div>
      </div>
    </div>
  );
};
