// src/components/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Jangan munculkan sidebar di halaman login
  if (pathname === "/login") return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { name: "Student Profile", href: "/student/profile", icon: "👤" },
    { name: "Admin Scanner", href: "/admin/scanner", icon: "📷" },
  ];

  return (
    <>
      {/* Header Mobile */}
      <header className="lg:hidden flex items-center justify-between bg-white border-b px-4 h-16 w-full fixed top-0 z-30">
        <button onClick={() => setIsOpen(true)} className="text-2xl p-2">☰</button>
        <span className="font-bold text-blue-600">PWA ABSENSI</span>
        <div className="w-10" />
      </header>

      {/* Overlay Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300
        lg:translate-x-0 lg:static lg:block
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 bg-blue-600 text-white font-bold text-lg shadow-sm">
            PWA APP 2026
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span> {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}