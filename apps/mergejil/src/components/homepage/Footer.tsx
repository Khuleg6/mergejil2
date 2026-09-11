import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/60 bg-[#06080c] py-4 px-6 text-xs text-gray-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500 font-bold text-black text-xs">
            М
          </div>
          <span className="font-semibold text-white">Мэргэжил.мн</span>
        </div>

        <p className="text-gray-500">
          © 2026 Мэргэжил.мн — Монголын карьер удирдамжийн платформ
        </p>
      </div>
    </footer>
  );
};

export default Footer;
