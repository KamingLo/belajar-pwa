import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { createQRToken } from "@/lib/auth-utils";
import StudentProfileClient from "@/components/StudentProfileClient";

// Definisikan interface untuk isi payload
interface JWTPayload {
  nama: string;
  id: string;
  role: string;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value || "";
  
  if (!authToken) {
    return <div className="p-10 text-center">Silahkan login terlebih dahulu.</div>;
  }

  try {
    const AUTH_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
    
    // PERBAIKAN: Destrukturisasi 'payload' dari hasil jwtVerify
    const { payload } = await jwtVerify(authToken, AUTH_SECRET);
    
    // Casting tipe data agar TS tahu ada properti nama dan id
    const userData = payload as unknown as JWTPayload;

    // Generate token awal (Server Side)
    const initialQR = await createQRToken({ 
      id: userData.id, 
      nama: userData.nama 
    });

    return (
      <StudentProfileClient 
        initialToken={initialQR} 
        initialNama={userData.nama} 
        initialId={userData.id} 
      />
    );
  } catch (error) {
    console.error("JWT Verify Error:", error);
    return <div className="p-10 text-center">Sesi berakhir, silakan login kembali.</div>;
  }
}