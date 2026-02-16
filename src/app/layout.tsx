import type { Metadata, Viewport } from "next"; // Tambahkan import type jika pakai TS
import "./globals.css";
import PWAInstaller from '@/components/PWAInstaller'

// 1. Metadata hanya untuk SEO dan informasi aplikasi
export const metadata: Metadata = {
  title: 'My PWA App',
  description: 'Built with Next.js',
  // themeColor dan viewport SUDAH TIDAK BOLEH di sini
};

// 2. Gunakan export viewport khusus untuk kontrol tampilan
export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  // Anda juga bisa menambahkan maximumScale: 1 jika ingin mencegah zoom (opsional)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
        <PWAInstaller />
        <body>{children}</body>
    </html>
  );
}