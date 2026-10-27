import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center pt-4 pb-2">
      <div className="inline-flex items-center justify-center gap-3.5 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25">
          <i className="ph-bold ph-book-open-text text-2xl" aria-hidden="true"></i>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
          Tanya<span className="text-emerald-600">Ustadz</span>{' '}
          <span className="text-xs align-top font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            PRO
          </span>
        </h1>
      </div>
      <p className="text-slate-500 font-medium text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        Asisten Digital Konsultasi Keagamaan Ilmiah Berbasis Dalil &amp; Kitab Mu&apos;tabar
      </p>
    </header>
  );
};
