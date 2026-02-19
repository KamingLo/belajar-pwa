"use client";
import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyQRToken } from "@/lib/auth-utils";

export default function AdminScanner() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const handleStopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch((err) => console.error("Stop error:", err));
    }
  };

  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length > 0) {
        setCameras(devices);
        const backCam = devices.find(d => 
          d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')
        );
        setSelectedCamera(backCam ? backCam.id : devices[0].id);
      }
    }).catch(() => setError("Akses kamera ditolak"));

    return () => handleStopScanner();
  }, []);

  const startScanner = async (cameraId: string) => {
    handleStopScanner();
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        cameraId,
        { fps: 20, qrbox: { width: 200, height: 200 } },
        onScanSuccess,
        () => {} 
      );
    } catch (err) {
      setError("Gagal memuat kamera");
    }
  };

  useEffect(() => {
    if (selectedCamera && !isSuccess) {
      startScanner(selectedCamera);
    }
    return () => handleStopScanner();
  }, [selectedCamera, isSuccess]);

  async function onScanSuccess(decodedText: string) {
    if (isSuccess) return;
    const payload = await verifyQRToken(decodedText);
    if (payload) {
      setResult(payload);
      setIsSuccess(true);
      if (navigator.vibrate) navigator.vibrate(100);
      handleStopScanner();
      
      setTimeout(() => {
        setIsSuccess(false);
        setResult(null);
      }, 2500);
    } else {
      setError("QR Tidak Valid");
      setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 antialiased">
      <div className="flex-1 flex flex-col items-center justify-between py-12 px-8 max-w-md mx-auto w-full">
        
        {/* Header */}
        <div className="text-center w-full">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Scanner Absensi</h1>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">Arahkan kamera ke kode QR siswa</p>
        </div>

        {/* Scanner Body */}
        <div className="w-full space-y-6 flex flex-col items-center">
          {/* Main Container dengan Border Tunggal */}
          <div className="relative w-full aspect-square rounded-[3rem] border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
            
            {/* Overlay Sukses - Full Box & High Z-Index */}
            {isSuccess && (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 z-20">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-100">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center px-6 w-full">
                  <p className="font-bold text-xl text-slate-900 break-words leading-tight">
                    {result?.nama}
                  </p>
                  <p className="text-slate-400 text-xs mt-2 uppercase tracking-[0.2em] font-medium">
                    {result?.id}
                  </p>
                </div>
                {/* Accent Line bawah sebagai pemanis */}
                <div className="absolute bottom-0 w-full h-1.5 bg-green-500" />
              </div>
            )}

            {/* Scanner Element - Di-hide saat sukses agar tidak mengintip di sela rounded */}
            <div 
              id="qr-reader" 
              className={`w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full [&_#qr-reader__dashboard]:hidden [&_#qr-reader__status_span]:hidden border-none ${isSuccess ? 'hidden' : 'block'}`}
            />
          </div>

          <div className="h-6">
            {error && <p className="text-red-500 text-center text-[13px] font-semibold animate-pulse italic">{error}</p>}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="w-full space-y-6">
          {!isSuccess && cameras.length > 1 && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pilih Kamera</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none focus:border-slate-400 transition-all appearance-none cursor-pointer"
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                >
                  {cameras.map((cam) => (
                    <option key={cam.id} value={cam.id}>{cam.label || `Kamera ${cam.id}`}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">Admin Mode • PWA</span>
          </div>
        </div>

      </div>
    </div>
  );
}