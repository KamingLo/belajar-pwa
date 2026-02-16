import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// 1. Deklarasi tipe agar TypeScript tidak protes
declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
  }
}

const self = globalThis as unknown as ServiceWorkerGlobalScope;

// 2. Inisialisasi Serwist
const serwist = new Serwist({
  // PENTING: Variabel ini harus ada agar build tidak error
  precacheEntries: self.__SW_MANIFEST, 
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();