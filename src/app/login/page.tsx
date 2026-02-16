import { createAuthToken } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Data Dummy untuk testing
const DUMMY_USERS = [
  { id: "1", email: "admin@pwa.com", nama: "Admin Ganteng", password: "password123", role: "admin" },
  { id: "2", email: "user@pwa.com", nama: "User Biasa", password: "password123", role: "student" },
];

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");

    // 1. Cari user berdasarkan email
    const user = DUMMY_USERS.find((u) => u.email === email);

    // 2. Validasi sederhana (Cek user dan password)
    if (!user || password !== "password123") {
      // Pada aplikasi nyata, arahkan kembali dengan pesan error
      return; 
    }

    // 3. Generate JWT Session (Gunakan AUTH_SECRET)
    const token = await createAuthToken({
      id: user.id,
      nama: user.nama,
      role: user.role,
    });

    // 4. Simpan di HttpOnly Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // Berlaku 1 hari
      path: "/",
    });

    // 5. Redirect Berdasarkan Role
    if (user.role === "admin") {
      redirect("/admin/scanner");
    } else {
      redirect("/student/profile");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">PWA Absensi</h1>
          <p className="text-slate-500 mt-2">Masuk untuk melanjutkan</p>
        </div>

        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required
              placeholder="admin@pwa.com atau user@pwa.com" 
              className="w-full p-3 mt-1 border border-slate-200 rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required
              placeholder="password123" 
              className="w-full p-3 mt-1 border border-slate-200 rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Akses Cepat Testing</p>
          <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg">
            Admin: admin@pwa.com <br/>
            Student: user@pwa.com <br/>
            Pass: password123
          </div>
        </div>
      </div>
    </div>
  );
}