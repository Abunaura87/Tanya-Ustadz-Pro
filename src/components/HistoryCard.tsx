import React from 'react';
import { ConsultationRecord } from '../utils/bahtsulLogic';

interface HistoryCardProps {
  records: ConsultationRecord[];
  isCloudSynced: boolean;
  onSelectRecord: (rec: ConsultationRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  records,
  isCloudSynced,
  onSelectRecord,
  onDeleteRecord,
}) => {
  if (records.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="history-heading"
      className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-7 no-print space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <i className="ph-bold ph-clock-counter-clockwise text-emerald-600 text-xl" aria-hidden="true"></i>
          <h2 id="history-heading" className="text-lg font-bold text-slate-800">
            Riwayat Bahtsul Masail ({records.length})
          </h2>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
          {isCloudSynced ? 'Tersinkron di Firebase Firestore' : 'Tersimpan di Perangkat'}
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-emerald-50/40 hover:border-emerald-200 p-3.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  {rec.answer.statusHukumSingkat}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{rec.createdAt}</span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  • {rec.answer.daftarDalil?.length || 0} Dalil Kitab
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800 truncate">{rec.question}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSelectRecord(rec)}
                className="text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                Buka Dalil
              </button>
              <button
                type="button"
                aria-label={`Hapus riwayat ${rec.question.slice(0, 30)}`}
                onClick={() => onDeleteRecord(rec.id)}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
              >
                <i className="ph-bold ph-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
