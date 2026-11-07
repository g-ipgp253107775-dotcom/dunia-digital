import React, { useRef } from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  BookOpen,
  Volume2,
  CheckCircle2,
  Gamepad2,
  Music,
  Eye,
  X,
  Keyboard,
  Smartphone,
} from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'LANGKAH 1 – KAWAL WATAK',
      desc: 'Gunakan papan kekunci (W A S D / Anak Panah) atau joystick maya pada telefon untuk menggerakkan watak pengembara cilik.',
      icon: 'Gamepad2',
      badgeColor: '#F5008F',
    },
    {
      num: 2,
      title: 'LANGKAH 2 – TEROKA DUNIA',
      desc: 'Berjalan di sepanjang laluan batu, jambatan kayu dan kawasan pulau terapung untuk mencari enam buah rumah maklumat.',
      icon: 'Compass',
      badgeColor: '#9DBB69',
    },
    {
      num: 3,
      title: 'LANGKAH 3 – DEKATI RUMAH',
      desc: 'Apabila watak menghampiri hadapan pintu rumah, lingkaran cahaya dan arahan terapung "TEKAN E UNTUK TEROKA" akan muncul.',
      icon: 'ArrowRight',
      badgeColor: '#E87991',
    },
    {
      num: 4,
      title: 'LANGKAH 4 – BUKA MAKLUMAT',
      desc: 'Tekan butang E atau butang "TEROKA SEKARANG" untuk membuka panel maklumat kurikulum dan strategi pengajaran bagi rumah tersebut.',
      icon: 'BookOpen',
      badgeColor: '#F4A6B8',
    },
    {
      num: 5,
      title: 'LANGKAH 5 – DENGAR PENERANGAN',
      desc: 'Tekan butang "🔊 DENGAR PENERANGAN" untuk mendengar bacaan maklumat menggunakan fungsi Text-to-Speech (TTS) Bahasa Melayu baku.',
      icon: 'Volume2',
      badgeColor: '#526B4C',
    },
    {
      num: 6,
      title: 'LANGKAH 6 – KUMPUL KRISTAL',
      desc: 'Setelah selesai meneroka, tekan butang "✓ SELESAI MENEROKA – KUMPUL KRISTAL" untuk menambah koleksi Kristal Ilmu anda (0/6).',
      icon: 'CheckCircle2',
      badgeColor: '#F5008F',
    },
  ];

  const handleReview = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#FFFCF8] border-3 border-[#E87991] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F5008F] to-[#E87991] p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-md">
                PANDUAN KHUSUS GURU
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                SELAMAT DATANG, CIKGU!
              </h2>
              <p className="text-xs text-white/90 font-bold">
                PANDUAN PENGGUNAAN PENGEMBARAAN PULAU ILMU
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

        {/* Scrollable Content Body */}
        <div ref={contentRef} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm flex-1 scrollbar-thin">
          {/* Welcome Message Card */}
          <div className="bg-[#FFF4E6] p-4 rounded-2xl border border-[#F4A6B8]/60 text-xs sm:text-sm text-[#3b2a26] leading-relaxed shadow-xs">
            <span className="font-black text-[#F5008F]">Selamat datang ke Pengembaraan Pulau Ilmu. </span>
            Dalam halaman ini, cikgu akan meneroka enam buah rumah yang mengandungi maklumat berkaitan perancangan pembelajaran Bahasa Melayu Tahun 5. Gerakkan watak pengembara, kunjungi setiap rumah, baca maklumat dan dengar penerangan menggunakan fungsi suara.
          </div>

          {/* 6 Steps Grid */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black text-[#526B4C] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9DBB69]" />
              Panduan Penerokaan Dalam Enam Langkah
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {steps.map((st) => (
                <div
                  key={st.num}
                  className="bg-white p-3 rounded-2xl border border-[#9DBB69]/40 shadow-xs flex items-start gap-2.5 hover:border-[#F5008F]/50 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: st.badgeColor }}
                  >
                    {st.num}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-[#36233B]">
                      {st.title}
                    </h4>
                    <p className="text-[11px] text-[#526B4C] leading-snug font-medium">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Quick Reference Sheet */}
          <div className="bg-white p-4 rounded-2xl border border-[#E87991]/40 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-[#36233B] uppercase tracking-wider flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-[#F5008F]" />
              Rujukan Ikon & Kawalan Pengembara
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-[#FFF4E6] rounded-xl border border-[#F4A6B8]/40">
                <span className="px-1.5 py-0.5 bg-white text-[#F5008F] rounded font-black text-[10px] shadow-xs">
                  W A S D
                </span>
                <span className="text-[11px] font-bold text-[#3b2a26]">Bergerak</span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#FFF4E6] rounded-xl border border-[#F4A6B8]/40">
                <Smartphone className="w-4 h-4 text-[#9DBB69]" />
                <span className="text-[11px] font-bold text-[#3b2a26]">Joystick Telefon</span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#FFF4E6] rounded-xl border border-[#F4A6B8]/40">
                <span className="px-2 py-0.5 bg-white text-[#F5008F] rounded font-black text-[10px] shadow-xs">
                  E
                </span>
                <span className="text-[11px] font-bold text-[#3b2a26]">Interaksi Rumah</span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#FFF4E6] rounded-xl border border-[#F4A6B8]/40">
                <span className="px-2 py-0.5 bg-white text-[#F5008F] rounded font-black text-[10px] shadow-xs">
                  Space
                </span>
                <span className="text-[11px] font-bold text-[#3b2a26]">Melompat</span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#FFF4E6] rounded-xl border border-[#F4A6B8]/40">
                <Music className="w-4 h-4 text-[#E87991]" />
                <span className="text-[11px] font-bold text-[#3b2a26]">Pemain Muzik</span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-[#FFF4E6] rounded-xl border border-[#F4A6B8]/40">
                <Eye className="w-4 h-4 text-[#526B4C]" />
                <span className="text-[11px] font-bold text-[#3b2a26]">Mod Kamera</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#FFF4E6] p-4 sm:px-6 border-t border-[#E87991]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleReview}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-[#FFFCF8] text-[#526B4C] text-xs font-bold rounded-xl border border-[#9DBB69]/50 shadow-xs transition-colors"
          >
            📖 LIHAT PANDUAN SEKALI LAGI
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#F5008F] to-[#E87991] hover:from-[#d6007d] hover:to-[#d0657c] text-white text-sm font-black rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🚀 MULA PENGEMBARAAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
