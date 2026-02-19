import { createAuthToken } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const DUMMY_USERS = [
  { id: "1", email: "admin@pwa.com", nama: "Admin Ganteng", password: "password123", role: "admin" },
  { id: "2", email: "user@pwa.com", nama: "User Biasa", password: "password123", role: "student" },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = DUMMY_USERS.find((u) => u.email === email);

    if (!user || password !== "password123") {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    const token = await createAuthToken({
      id: user.id,
      nama: user.nama,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: true, // Wajib true untuk production/Vercel
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({ 
      success: true, 
      role: user.role,
      redirect: user.role === "admin" ? "/admin" : "/student"
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}