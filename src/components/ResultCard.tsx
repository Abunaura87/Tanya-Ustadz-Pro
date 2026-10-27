import React, { useState } from 'react';
import {
  ScholarlyAnswer,
  getCategoryStyle,
  formatPlainTextResult,
} from '../utils/bahtsulLogic';

interface ResultCardProps {
  question: string;
  isLoading: boolean;
  answer: ScholarlyAnswer | null;
  loadingRef: React.RefObject<HTMLDivElement | null>;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  question,
  isLoading,
  answer,
  loadingRef,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!answer) return;
    const plainText = formatPlainTextResult(question, answer);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(plainText);
      } else {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = plainText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = plainText;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      aria-labelledby="result-heading"
      className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
    >
      {/* Header Card Hasil */}
      <div className="p-5 sm:px-8 sm:py-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <i className="ph-bold ph-book-open text-emerald-600 text-2xl" aria-hidden="true"></i>
          <h2 id="result-heading" className="text-xl font-bold text-slate-800">
            Hasil Bahtsul &amp; Paparan Dalil
          </h2>
        </div>

        {/* Action Buttons (Muncul saat hasil sudah ada) */}
        {answer && !isLoading && (
          <div id="resultActions" className="flex items-center gap-2 no-print">
            <button
              type="button"
              id="copyResultBtn"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <i className="ph-bold ph-copy" aria-hidden="true"></i>
              <span id="copyBtnLabel">{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <i className="ph-bold ph-printer" aria-hidden="true"></i>
              Cetak / PDF
            </button>
          </div>
        )}
      </div>

      {/* State 1: Empty State */}
      {!isLoading && !answer && (
        <div id="emptyState" className="py-16 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-5 text-slate-300">
            <i className="ph-bold ph-chat-centered-text text-5xl" aria-hidden="true"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-400 mb-1.5">Menunggu Pertanyaan</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Jawaban ilmiah beserta kutipan kitab asli akan tampil otomatis sesuai referensi yang
            Anda pilih di atas.
          </p>
        </div>
      )}

      {/* State 2: Loading Skeleton State */}
      {isLoading && (
        <div
          id="loadingState"
          ref={loadingRef}
          role="status"
          aria-live="polite"
          className="py-14 px-6 sm:px-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-600 animate-bounce">
            <i className="ph-duotone ph-books text-4xl" aria-hidden="true"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Sedang Menelaah Kitab &amp; Menyusun Tahqiq Dalil...
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            AI sedang menelusuri nash Al-Qur&apos;an, Hadits, Ibarat Kitab Turats, dan pendapat
            ahli sesuai parameter referensi Anda.
          </p>
          <div className="max-w-lg mx-auto space-y-3 text-left">
            <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse-subtle"></div>
            <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse-subtle"></div>
            <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse-subtle"></div>
          </div>
        </div>
      )}

      {/* State 3: Konten Hasil Jawaban AI */}
      {!isLoading && answer && (
        <div id="resultContent" className="p-5 sm:p-8 space-y-6">
          {/* Kotak Ringkasan Pertanyaan & Intisari Hukum */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-3 py-1 rounded-full">
                <i className="ph-fill ph-check-circle" aria-hidden="true"></i> Kesimpulan &amp;
                Ringkasan Hukum
              </span>
              <span
                id="resultStatusBadge"
                className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white"
              >
                {answer.statusHukumSingkat || 'Tahqiq Ilmiah'}
              </span>
            </div>
            <p
              id="resultSummaryText"
              className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed"
            >
              {answer.ringkasanInti}
            </p>
          </div>

          {/* Daftar Dalil & Kutipan Kitab Asli Berdasarkan Referensi */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <i className="ph-fill ph-scroll text-emerald-600 text-xl" aria-hidden="true"></i>
              Rincian Dalil &amp; Kutipan Kitab Asli
            </h3>
            <div id="dalilListContainer" className="space-y-4">
              {(answer.daftarDalil || []).map((item, idx) => {
                const style = getCategoryStyle(item.kategoriReferensi);
                const hasArabic =
                  item.teksArabAsli &&
                  item.teksArabAsli.trim() !== '' &&
                  item.teksArabAsli.trim() !== '-';

                return (
                  <div
                    key={`${item.kategoriReferensi}-${idx}`}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3.5 transition hover:border-emerald-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border ${style.badgeBg}`}
                      >
                        <i className={`ph-fill ${style.icon}`} aria-hidden="true"></i>
                        {idx + 1}. {item.kategoriReferensi}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                        <i className="ph-bold ph-bookmark-simple" aria-hidden="true"></i>
                        {item.namaKitabAtauSumber}
                      </span>
                    </div>

                    {hasArabic && (
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-right">
                        <p
                          lang="ar"
                          dir="rtl"
                          className="arabic-text text-xl sm:text-2xl text-slate-900 font-normal select-all"
                        >
                          {item.teksArabAsli}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm text-slate-700 italic bg-emerald-50/40 border-l-4 border-emerald-500 pl-3.5 py-1.5 leading-relaxed">
                        &ldquo;{item.terjemahanIndonesia}&rdquo;
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed pt-1">
                        <span className="font-bold text-slate-800">Penjelasan Dalil:</span>{' '}
                        {item.syarahSingkat}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analisis Istinbath & Uraian Komprehensif */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 sm:p-6 space-y-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <i className="ph-fill ph-scales text-emerald-600 text-xl" aria-hidden="true"></i>
              Analisis Istinbath Hukum &amp; Penjelasan Komprehensif
            </h3>
            <div
              id="resultAnalysisText"
              className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3"
            >
              {(answer.analisisIstinbath || []).map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Hikmah & Saran Praktis */}
          <div className="rounded-2xl bg-amber-50/60 border border-amber-200/70 p-5">
            <h4 className="text-sm font-extrabold text-amber-900 flex items-center gap-2 mb-2">
              <i
                className="ph-fill ph-lightbulb-filament text-amber-600 text-lg"
                aria-hidden="true"
              ></i>
              Hikmah &amp; Panduan Amal (Tathbiq)
            </h4>
            <p id="resultHikmahText" className="text-amber-950/90 text-sm leading-relaxed">
              {answer.hikmahDanSaran}
            </p>
          </div>
        </div>
      )}

      {/* Footer Card */}
      <div className="bg-slate-50/80 border-t border-slate-100 py-4 px-6 text-center">
        <p className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-400 uppercase">
          TANYA USTADZ PRO BY MESIN AI - ALL RIGHTS RESERVED 2026
        </p>
      </div>
    </section>
  );
};
