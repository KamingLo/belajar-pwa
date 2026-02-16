import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nama Aplikasi Anda',
    short_name: 'NamaSingkat',
    description: 'Deskripsi aplikasi PWA saya',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo_pelita-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo_pelita-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}