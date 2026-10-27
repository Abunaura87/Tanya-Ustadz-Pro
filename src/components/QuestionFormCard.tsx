import React, { useState, useRef, useEffect } from 'react';
import {
  REFERENCE_OPTIONS,
  MADZHAB_OPTIONS,
  DEPTH_OPTIONS,
  getReferenceSummaryText,
  getToggleAllLabel,
} from '../utils/bahtsulLogic';

interface QuestionFormCardProps {
  question: string;
  onQuestionChange: (val: string) => void;
  selectedSources: string[];
  onToggleSource: (val: string) => void;
  onToggleAllSources: () => void;
  madzhabFocus: string;
  onMadzhabChange: (val: string) => void;
  depthLevel: string;
  onDepthChange: (val: string) => void;
  onSampleQuestion: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  validationError: string | null;
}

export const QuestionFormCard: React.FC<QuestionFormCardProps> = ({
  question,
  onQuestionChange,
  selectedSources,
  onToggleSource,
  onToggleAllSources,
  madzhabFocus,
  onMadzhabChange,
  depthLevel,
  onDepthChange,
  onSampleQuestion,
  onSubmit,
  isLoading,
  validationError,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSampleClick = () => {
    onSampleQuestion();
    textareaRef.current?.focus();
  };

  const selectedOptionObjects = REFERENCE_OPTIONS.filter((opt) =>
    selectedSources.includes(opt.value)
  );

  return (
    <section
      aria-labelledby="parameter-heading"
      className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-8 no-print"
    >
      {/* Judul Seksi */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <i className="ph-fill ph-sparkle text-emerald-600 text-2xl" aria-hidden="true"></i>
          <h2 id="parameter-heading" className="text-xl font-bold text-slate-800">
            Parameter Pertanyaan
          </h2>
        </div>
        <button
          type="button"
          id="btnSampleQuestion"
          onClick={handleSampleClick}
          className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <i className="ph-bold ph-magic-wand" aria-hidden="true"></i> Contoh Pertanyaan
        </button>
      </div>

      <form id="qaForm" onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Kotak Pertanyaan */}
        <div>
          <label
            htmlFor="questionInput"
            className="block text-sm font-bold text-slate-700 mb-2"
          >
            Pertanyaan / Permasalahan Anda
          </label>
          <textarea
            ref={textareaRef}
            id="questionInput"
            rows={4}
            required
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Contoh: Bagaimana hukum transaksi jual beli sistem dropshipping dalam tinjauan fiqh muamalah? Atau bagaimana hukum sholat memakai parfum beralkohol?"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition text-sm sm:text-base resize-y"
          />
        </div>

        {/* Pilihan Dropdown Referensi Pengambilan Dalil (Multi-Select Dropdown + Badges) */}
        <div className="relative" id="referenceDropdownContainer" ref={dropdownContainerRef}>
          <div className="flex items-center justify-between mb-2">
            <span id="refDropdownLabel" className="block text-sm font-bold text-slate-700">
              Pilih Sumber Referensi Dalil{' '}
              <span className="text-emerald-600 font-normal text-xs">
                (Bisa pilih satu atau banyak)
              </span>
            </span>
            <button
              type="button"
              id="toggleAllRefs"
              onClick={onToggleAllSources}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              {getToggleAllLabel(selectedSources.length, REFERENCE_OPTIONS.length)}
            </button>
          </div>

          {/* Tombol Trigger Dropdown */}
          <button
            type="button"
            id="refDropdownButton"
            aria-expanded={dropdownOpen}
            aria-labelledby="refDropdownLabel refDropdownSummary"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white px-4 py-3.5 text-left flex items-center justify-between focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <i
                className="ph-duotone ph-books text-emerald-600 text-xl shrink-0"
                aria-hidden="true"
              ></i>
              <span
                id="refDropdownSummary"
                className="font-semibold text-slate-700 text-sm sm:text-base truncate"
              >
                {getReferenceSummaryText(selectedSources.length, REFERENCE_OPTIONS.length)}
              </span>
            </div>
            <i
              id="refDropdownChevron"
              aria-hidden="true"
              className={`ph-bold ph-caret-down text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            ></i>
          </button>

          {/* Menu Dropdown Checkbox */}
          {dropdownOpen && (
            <div
              id="refDropdownMenu"
              role="group"
              aria-label="Daftar Sumber Referensi Dalil"
              className="absolute z-30 mt-2 w-full rounded-2xl bg-white shadow-xl border border-slate-200 p-2 space-y-1 max-h-80 overflow-y-auto"
            >
              {REFERENCE_OPTIONS.map((opt) => {
                const isChecked = selectedSources.includes(opt.value);
                return (
                  <label
                    key={opt.id}
                    htmlFor={opt.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/60 cursor-pointer transition"
                  >
                    <input
                      id={opt.id}
                      type="checkbox"
                      name="refSource"
                      value={opt.value}
                      checked={isChecked}
                      onChange={() => onToggleSource(opt.value)}
                      className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 accent-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-800">{opt.title}</div>
                      <div className="text-xs text-slate-500">{opt.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* Chip / Badge Referensi Aktif */}
          <div id="activeRefBadges" className="flex flex-wrap gap-1.5 mt-3">
            {selectedOptionObjects.map((opt) => (
              <span
                key={opt.id}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl"
              >
                <i className="ph-fill ph-check-circle text-emerald-600" aria-hidden="true"></i>
                {opt.label}
              </span>
            ))}
          </div>
        </div>

        {/* 2 Kolom Dropdown Tambahan: Fokus Madzhab & Kedalaman */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label
              htmlFor="madzhabSelect"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Fokus Madzhab Fiqh
            </label>
            <div className="relative">
              <select
                id="madzhabSelect"
                value={madzhabFocus}
                onChange={(e) => onMadzhabChange(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 pr-9 font-semibold text-slate-700 text-sm focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition"
              >
                {MADZHAB_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <i
                className="ph-bold ph-caret-down text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              ></i>
            </div>
          </div>

          <div>
            <label
              htmlFor="depthSelect"
              className="block text-sm font-bold text-slate-700 mb-2"
            >
              Kedalaman Pemaparan
            </label>
            <div className="relative">
              <select
                id="depthSelect"
                value={depthLevel}
                onChange={(e) => onDepthChange(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 pr-9 font-semibold text-slate-700 text-sm focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition"
              >
                {DEPTH_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <i
                className="ph-bold ph-caret-down text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              ></i>
            </div>
          </div>
        </div>

        {/* Pesan Peringatan Validasi (Tanpa Alert) */}
        {validationError && (
          <div
            id="validationMessage"
            role="alert"
            className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-amber-800 text-sm flex items-center gap-2.5"
          >
            <i
              className="ph-fill ph-warning-circle text-lg shrink-0 text-amber-600"
              aria-hidden="true"
            ></i>
            <span id="validationText">{validationError}</span>
          </div>
        )}

        {/* Tombol Submit Utama */}
        <div className="pt-2">
          <button
            type="submit"
            id="submitBtn"
            disabled={isLoading}
            className={`w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-4 px-6 shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2.5 text-base cursor-pointer ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            <i
              id="submitIcon"
              aria-hidden="true"
              className={
                isLoading
                  ? 'ph-bold ph-spinner animate-spin text-xl'
                  : 'ph-bold ph-paper-plane-tilt text-xl'
              }
            ></i>
            <span id="submitBtnText">
              {isLoading
                ? 'Sedang Menelaah Kitab & Dalil...'
                : 'Paparkan Jawaban & Dalil Kitab'}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
};
