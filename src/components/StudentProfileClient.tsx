// src/components/StudentProfileClient.tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { createQRToken } from "@/lib/auth-utils";

// Definisikan tipe untuk Props agar TS tidak error
interface StudentProfileProps {
  initialToken: string;
  initialNama: string;
  initialId: string;
}

export default function StudentProfileClient({ 
  initialToken, 
  initialNama, 
  initialId 
}: StudentProfileProps) {
  const [token, setToken] = useState<string>(initialToken);
  const [nama, setNama] = useState<string>(initialNama);
  const [idSiswa, setIdSiswa] = useState<string>(initialId);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTestGenerate = async () => {
    setLoading(true);
    try {
      // Pastikan data tidak kosong
      if (!nama || !idSiswa) {
        alert("Nama dan ID harus diisi!");
        return;
      }

      const newToken = await createQRToken({ 
        id: idSiswa, 
        nama: nama 
      });
      
      setToken(newToken);
    } catch (err) {
      console.error("Gagal generate QR:", err);
      alert("Gagal generate QR. Cek console browser.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl max-w-sm mx-auto text-slate-800">
      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-bold text-center">Test QR Generator</h2>
        <input 
          type="text" 
          value={nama} 
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama"
          className="w-full border p-2 rounded-lg bg-slate-50"
        />
        <input 
          type="text" 
          value={idSiswa} 
          onChange={(e) => setIdSiswa(e.target.value)}
          placeholder="ID Siswa"
          className="w-full border p-2 rounded-lg bg-slate-50"
        />
        <button 
          onClick={handleTestGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg font-bold disabled:bg-slate-400"
        >
          {loading ? "Processing..." : "Generate QR Baru"}
        </button>
      </div>

      <div className="flex justify-center p-4 border-2 border-dashed rounded-xl">
        <QRCodeSVG value={token} size={200} />
      </div>
    </div>
  );
}