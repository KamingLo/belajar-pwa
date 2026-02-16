'use client'
import { useEffect } from 'react'

export default function PWAInstaller() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('PWA Siap Offline'))
        .catch((err) => console.error('Gagal daftar SW', err));
    }
  }, [])
  return null
}