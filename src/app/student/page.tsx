import Link from "next/link";

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto">
      {/* Profile Summary */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-900/40">
          🎓
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Selamat Pagi, Siswa!</h1>
          <p className="text-slate-400 text-sm">Sudahkah kamu absen hari ini?</p>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-4">
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
        <p className="text-emerald-400 text-sm font-medium">Status Anda: <span className="uppercase">Hadir</span></p>
      </div>

      {/* Navigation Buttons */}
      <div className="grid gap-4">
        <Link 
          href="/student/profile"
          className="group flex items-center justify-between p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:border-blue-500 transition-all active:scale-98"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl group-hover:scale-110 transition-transform">🆔</span>
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">Tampilkan QR Code</h3>
              <p className="text-slate-400 text-sm text-balance">Gunakan kode unikmu untuk melakukan absensi.</p>
            </div>
          </div>
          <span className="text-slate-500 group-hover:text-blue-500">→</span>
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-bold">Kehadiran</p>
            <p className="text-2xl font-bold text-white">98%</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center">
            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-bold">Poin</p>
            <p className="text-2xl font-bold text-white">1,250</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <footer className="bg-slate-800/30 p-4 rounded-xl text-center border border-slate-700">
        <p className="text-slate-500 text-xs">
          Butuh bantuan? Hubungi Admin Sekolah melalui menu bantuan.
        </p>
      </footer>
    </div>
  );
}