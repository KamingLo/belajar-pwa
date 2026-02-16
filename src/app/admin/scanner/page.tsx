"use client";
import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { verifyQRToken } from "@/lib/auth-utils";

export default function AdminScanner() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Inisialisasi Scanner
    if (!isSuccess) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 15, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0 
        },
        false
      );

      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isSuccess]);

  async function onScanSuccess(decodedText: string) {
    const payload = await verifyQRToken(decodedText);
    
    if (payload) {
      setResult(payload);
      setIsSuccess(true); // Tampilkan halaman centang
      
      // Hentikan scanner sementara
      if (scannerRef.current) {
        await scannerRef.current.clear();
      }

      // Delay 1.5 detik agar user bisa melihat status sukses
      setTimeout(() => {
        setIsSuccess(false);
        setResult(null);
      }, 1500);
    } else {
      setError("QR Expired atau Tidak Valid!");
      setTimeout(() => setError(""), 3000); // Hilangkan error setelah 3 detik
    }
  }

  function onScanError(err: any) {
    // Abaikan error scan gagal (mencari frame)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* State: UI Sukses (Halaman Centang) */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Berhasil Dicatat!</h2>
              <p className="text-green-400 font-medium">{result?.nama}</p>
              <p className="text-slate-400 text-sm mt-1 uppercase tracking-tighter">{result?.id}</p>
            </div>
          </div>
        ) : (
          /* State: UI Kamera (Scanner) */
          <div className="space-y-6">
            <header className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">QR Scanner Admin</h1>
              <p className="text-slate-400 text-sm">Arahkan kamera ke kode QR siswa</p>
            </header>

            <div className="relative group">
              {/* Dekorasi Bingkai Scanner (Corner Borders) */}
              <div className="absolute inset-0 z-10 pointer-events-none border-2 border-transparent">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
              </div>

              {/* Area Kamera */}
              <div className="overflow-hidden rounded-2xl bg-slate-800 shadow-2xl ring-1 ring-white/10">
                <div id="qr-reader" className="w-full" />
              </div>
            </div>

            {/* Notification Error */}
            <div className={`transition-all duration-300 transform ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-center text-sm font-medium">
                ⚠️ {error}
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-semibold transition-all border border-white/5 active:scale-95"
            >
              🔄 Muat Ulang Kamera
            </button>
          </div>
        )}

      </div>
    </div>
  );
}