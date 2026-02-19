"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
import { createQRToken } from "@/lib/auth-utils";
import { decodeJwt } from "jose";

interface StudentProfileProps {
  initialToken: string;
  initialNama: string;
  initialId: string;
}

export default function StudentProfileClient({
  initialToken,
  initialNama,
  initialId,
}: StudentProfileProps) {
  const [token, setToken] = useState<string>(initialToken);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;
    try {
      const payload = decodeJwt(token);
      if (!payload.exp) return;

      const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const distance = payload.exp! - now;

        if (distance <= 0) {
          setIsExpired(true);
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setIsExpired(false);
          setTimeLeft(distance);
        }
      }, 1000);

      return () => clearInterval(interval);
    } catch (e) {
      console.error("Invalid token format");
    }
  }, [token]);

  const handleRefreshQR = async () => {
    setLoading(true);
    try {
      const newToken = await createQRToken({ id: initialId, nama: initialNama });
      setToken(newToken);
      setIsExpired(false);
    } catch (err) {
      alert("Gagal memperbarui QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-slate-800">
      <div className="w-full max-w-sm space-y-8">
        
        {/* Header - Identitas Sederhana */}
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{initialNama}</h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium">NIS: {initialId}</p>
        </div>

        {/* QR Container - 1 Border Saja (Sesuai gaya scanner) */}
        <div className="relative aspect-square w-full rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 flex items-center justify-center overflow-hidden transition-all">
          <div className={`transition-all duration-500 ${isExpired ? "opacity-10 blur-sm scale-90" : "opacity-100"}`}>
            <QRCodeSVG 
              value={token} 
              size={200} 
              level="M" 
              includeMargin={false}
              fgColor="#1e293b" // Slate-800 agar tidak terlalu hitam pekat
            />
          </div>

          {/* Expired Overlay */}
          {isExpired && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
              <p className="text-slate-400 text-xs font-medium mb-4 italic text-center">Kode QR telah kadaluwarsa</p>
              <button 
                onClick={handleRefreshQR}
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                {loading ? "Memproses..." : "Perbarui Kode"}
              </button>
            </div>
          )}
        </div>

        {/* Status & Timer Minimalis */}
        <div className="text-center space-y-4">
          {!isExpired ? (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Siap Di-Scan
              </div>
              <p className="text-slate-400 text-xs">
                Berakhir dalam <span className="text-slate-900 font-mono font-bold tracking-tight">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </p>
            </div>
          ) : (
            <p className="text-slate-300 text-[10px] uppercase tracking-[0.2em] font-bold">Akses Terkunci</p>
          )}
        </div>

        {/* Security Notice Minimalis */}
        <p className="text-center text-slate-400 text-[10px] px-8 leading-relaxed uppercase tracking-widest">
          Gunakan kode ini untuk absensi hari ini.
        </p>

      </div>
    </div>
  );
}