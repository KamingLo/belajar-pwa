import { SignJWT, jwtVerify } from "jose";

// Pastikan secret tidak undefined agar tidak muncul error 'no importKey'
const AUTH_SECRET_STR = process.env.JWT_SECRET || "fallback-login-secret-32-chars-min";
const AUTH_SECRET = new TextEncoder().encode(AUTH_SECRET_STR);

// Gunakan NEXT_PUBLIC agar bisa dibaca di Scanner (Client Side)
const QR_SECRET_STR = process.env.NEXT_PUBLIC_QR_SECRET || "fallback-qr-secret-32-chars-min";
const QR_SECRET = new TextEncoder().encode(QR_SECRET_STR);

// 1. Untuk Sesi Login (Server Side)
export const createAuthToken = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Tambahkan durasi agar sesi tidak selamanya aktif
    .sign(AUTH_SECRET);
};

// 2. Untuk QR Code (Server & Client Side)
export const createQRToken = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10s") // QR hangus dalam 10 detik
    .sign(QR_SECRET);
};

// 3. Verifikasi QR di sisi Scanner (Client Side)
export const verifyQRToken = async (token: string) => {
  try {
    if (!token) return null;
    // jose otomatis melempar error jika token expired atau signature salah
    const { payload } = await jwtVerify(token, QR_SECRET);
    return payload;
  } catch (error) {
    // console.error ini akan muncul di inspeksi browser scanner jika gagal
    console.error("QR Verification Failed:", error); 
    return null;
  }
};