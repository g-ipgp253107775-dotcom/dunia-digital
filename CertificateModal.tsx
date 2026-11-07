import React, { useState } from 'react';
import { Sparkles, Printer, Download, X, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { HOUSES_DATA } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, collectedCount }) => {
  const [recipientName, setRecipientName] = useState<string>('CIKGU / MURID TAHUN 5');

  if (!isOpen) return null;

  // Format today's date in Malay
  const today = new Date();
  const dateStr = today.toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="certificate-modal-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none overflow-y-auto"
    >
      <div className="w-full max-w-3xl flex flex-col bg-[#FFFCF8] border-4 border-[#E87991] rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Controls (Hidden during print) */}
        <div className="print:hidden bg-gradient-to-r from-[#F5008F] to-[#E87991] p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-yellow-300" />
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide">
                SIJIL PENGHARGAAN PENJELAJAR PULAU ILMU
              </h2>
              <p className="text-xs text-white/90 font-medium">
                Selesai 6/6 Kristal Ilmu • Sedia Untuk Dicetak & Disimpan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Name input toolbar (Hidden during print) */}
        <div className="print:hidden bg-[#FFF4E6] p-3 sm:px-6 border-b border-[#F4A6B8]/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <span className="font-bold text-[#526B4C] shrink-0">Nama Penerima Sijil:</span>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value.toUpperCase())}
              placeholder="Masukkan Nama Anda..."
              className="flex-1 bg-white border border-[#E87991]/60 px-3 py-1.5 rounded-xl font-black text-[#36233B] outline-none focus:ring-2 focus:ring-[#F5008F]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#F5008F] hover:bg-[#d6007d] text-white font-black rounded-xl shadow-xs transition-transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* ==========================================
            THE CERTIFICATE SHEET (PRINTABLE)
            ========================================== */}
        <div
          id="certificate-sheet"
          className="p-6 sm:p-10 m-3 sm:m-6 bg-[#FFFCF8] border-8 border-double border-[#F5008F] rounded-2xl relative shadow-inner overflow-hidden text-center space-y-4"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-10 h-10 border-t-4 border-l-4 border-[#9DBB69] rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-10 h-10 border-t-4 border-r-4 border-[#9DBB69] rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-10 h-10 border-b-4 border-l-4 border-[#9DBB69] rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-10 h-10 border-b-4 border-r-4 border-[#9DBB69] rounded-br-lg" />

          {/* Certificate Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#F5008F] to-[#E87991] text-white text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>KEMENTERIAN PENDIDIKAN MALAYSIA</span>
            <Sparkles className="w-3.5 h-3.5 fill-white" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#36233B] tracking-tight uppercase">
              SIJIL PENGHARGAAN
            </h1>
            <p className="text-sm sm:text-base font-extrabold text-[#9DBB69] tracking-widest uppercase mt-1">
              PENJELAJAR PULAU ILMU
            </p>
          </div>

          <p className="text-xs text-[#526B4C] font-semibold">
            Dengan ini diperakui dan disahkan bahawa:
          </p>

          {/* Recipient Name Highlight */}
          <div className="py-2">
            <span className="inline-block text-xl sm:text-3xl font-black text-[#F5008F] tracking-wide border-b-2 border-dashed border-[#F5008F] px-8 pb-1">
              {recipientName || 'CIKGU / MURID TAHUN 5'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#3b2a26] max-w-xl mx-auto leading-relaxed">
            Telah berjaya menyelesaikan seluruh pengembaraan dan meneroka keenam-enam Rumah Pembelajaran berteraskan kurikulum <strong>Bahasa Melayu Tahun 5</strong> dalam projek:
          </p>

          <div className="bg-[#FFF4E6] p-3 rounded-2xl border border-[#F4A6B8]/60 max-w-lg mx-auto">
            <h3 className="text-xs sm:text-sm font-black text-[#E87991]">
              MISTERI DI SEBALIK SUNGAI
            </h3>
            <p className="text-[11px] font-bold text-[#526B4C]">
              Pengembaraan Lima Sahabat Menyelamatkan Alam
            </p>
          </div>

          {/* 6 Crystal Badges Display */}
          <div className="pt-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526B4C] block mb-2">
              6 Kristal Ilmu Berjaya Dikumpulkan:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-xl mx-auto">
              {HOUSES_DATA.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-[#9DBB69]/50 shadow-xs"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white mb-1 shadow-xs"
                    style={{ backgroundColor: h.themeColor }}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-white text-white" />
                  </div>
                  <span className="text-[9px] font-bold text-[#3b2a26] leading-tight truncate w-full">
                    {h.crystalName.replace('Kristal ', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 flex items-end justify-between border-t border-[#F4A6B8]/40 text-left text-xs">
            <div>
              <span className="block text-[11px] text-[#526B4C] font-semibold">Tarikh Kejayaan:</span>
              <span className="font-black text-[#36233B]">{dateStr}</span>
            </div>

            {/* Golden Ribbon Stamp */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-amber-600 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-8 h-8 text-amber-800" />
              </div>
              <span className="text-[9px] font-black text-amber-800 tracking-wider uppercase mt-1">
                KECEMERLANGAN
              </span>
            </div>

            <div className="text-right">
              <span className="block text-[11px] text-[#526B4C] font-semibold">Status Pengesahan:</span>
              <span className="font-black text-[#9DBB69]">LULUS 6/6 KRISTAL</span>
            </div>
          </div>
        </div>

        {/* Footer actions for screen view */}
        <div className="print:hidden bg-[#FFF4E6] p-4 sm:px-6 border-t border-[#E87991]/40 flex items-center justify-between">
          <span className="text-xs text-[#526B4C] font-bold">
            💡 Petua: Pilih "Save as PDF" dalam tetingkap cetakan untuk menyimpan salinan digital.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-[#FFFCF8] text-[#36233B] text-xs font-bold rounded-xl border border-[#E87991]/50 shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
