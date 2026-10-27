import React from 'react';
import { User } from 'firebase/auth';
import { firebaseProjectInfo } from '../firebase';

interface HeaderProps {
  user: User | null;
  authReady: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  authError: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  authReady,
  onSignIn,
  onSignOut,
  authError,
}) => {
  return (
    <header className="text-center pt-4 pb-2 space-y-4">
      <div>
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
      </div>

      {/* Cloud Bar: Firebase Auth + Firestore + Vercel Ready */}
      <div className="no-print bg-white/90 border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span
            title={`Project ID: ${firebaseProjectInfo.projectId}`}
            className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg"
          >
            <i className="ph-fill ph-database text-emerald-600" aria-hidden="true"></i>
            Firebase ({firebaseProjectInfo.projectId})
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
            <i className="ph-fill ph-cloud-check text-emerald-600" aria-hidden="true"></i>
            Vercel Serverless Ready
          </span>
        </div>

        <div className="flex items-center gap-2">
          {authReady && user ? (
            <>
              <span className="text-slate-600 font-semibold truncate max-w-[180px]">
                {user.displayName || user.email}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="font-bold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                Keluar
              </button>
            </>
          ) : (
            <button
              type="button"
              id="btnGoogleLogin"
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <i className="ph-bold ph-google-logo text-emerald-600" aria-hidden="true"></i>
              Masuk Google (Simpan Riwayat Cloud)
            </button>
          )}
        </div>
      </div>

      {authError && (
        <div className="no-print rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-xs text-amber-800">
          {authError}
        </div>
      )}
    </header>
  );
};
