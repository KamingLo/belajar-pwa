import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Hadir", value: "124", icon: "📈", color: "text-emerald-500" },
    { label: "Siswa Terlambat", value: "12", icon: "⏰", color: "text-amber-500" },
    { label: "Belum Absen", value: "45", icon: "👤", color: "text-rose-500" },
  ];

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Welcome Section */}
      <header>
        <h1 className="text-3xl font-extrabold text-white">Halo, Admin! 👋</h1>
        <p className="text-slate-400 mt-2">Pantau kehadiran siswa hari ini secara real-time.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-slate-400 text-sm mt-2 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Action Section */}
      <section className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-bold">Mulai Sesi Absensi</h2>
          <p className="text-blue-100 max-w-md">
            Gunakan kamera perangkat untuk memindai QR Code siswa dengan cepat dan akurat.
          </p>
          <Link 
            href="/admin/scanner"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95"
          >
            📷 Buka Scanner QR
          </Link>
        </div>
        {/* Dekorasi Abstract */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Recent Activity Placeholder */}
      <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl p-10 text-center">
        <p className="text-slate-500 italic">Log aktivitas terbaru akan muncul di sini.</p>
      </div>
    </div>
  );
}