// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import PWAInstaller from '@/components/PWAInstaller';

const inter = Inter({ subsets: ["latin"] });

// 1. Metadata SEO
export const metadata: Metadata = {
  title: 'PWA Absensi 2026',
  description: 'Sistem Absensi Offline-First dengan QR Code',
  manifest: '/manifest.json', // Pastikan manifest terdaftar untuk PWA
};

// 2. Viewport & Theme (Standar Next.js 15/16)
export const viewport: Viewport = {
  themeColor: '#2563eb', // Warna biru primer
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Bagus untuk UX aplikasi PWA agar tidak "goyang" saat zoom
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-900`}>
        <PWAInstaller />
        
        {/* Kontainer Utama dengan Flex */}
        <div className="flex min-h-screen overflow-hidden">
          
          {/* Sidebar (Lebar tetap di desktop, hidden/absolute di mobile) */}
          <Sidebar />

          {/* Konten Utama (Mengambil sisa ruang) */}
          <main className="flex-1 relative overflow-y-auto">
            {/* Beri pt-16 hanya di mobile agar tidak tertutup header hamburger */}
            <div className="pt-16 lg:pt-0">
              {children}
            </div>
          </main>
          
        </div>
      </body>
    </html>
  );
}