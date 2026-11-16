"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/pacientes", label: "Pacientes", icon: "🧑‍⚕️" },
  { href: "/doctores", label: "Doctores", icon: "👨‍⚕️" },
  { href: "/citas", label: "Citas", icon: "📅" },
  { href: "/consultas", label: "Historial de consultas", icon: "📋" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top bar (mobile) */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4 md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="text-lg font-bold text-blue-700">App Clínica</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </header>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white p-4 transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <span className="text-lg font-bold text-blue-700">App Clínica</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto text-xs text-gray-400 px-2">Administración básica</div>
      </aside>
    </>
  );
}