"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listDoctoresAction } from "@/features/doctores/actions/doctorActions";
import { deleteDoctorAction } from "@/features/doctores/actions/doctorActions";
import { Card } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { Doctor } from "@/types";

export default function DoctoresPage() {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    listDoctoresAction()
      .then((data) => {
        if (mounted) setDoctores(data);
      })
      .catch((e) => {
        if (mounted) setError(e?.message ?? "Error al cargar doctores");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = doctores.filter((d) => {
    const q = query.toLowerCase();
    return (
      !q ||
      `${d.nombre} ${d.apellido}`.toLowerCase().includes(q) ||
      d.especialidad.toLowerCase().includes(q) ||
      (d.email || "").toLowerCase().includes(q)
    );
  });

  async function handleDelete(id: string) {
    await deleteDoctorAction(id);
    setDoctores((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Doctores</h1>
          <p className="text-sm text-gray-500">{doctores.length} registrados</p>
        </div>
        <Link
          href="/doctores/nuevo"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nuevo doctor
        </Link>
      </div>

      <input
        type="search"
        placeholder="Buscar por nombre, especialidad o email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:max-w-md"
      />

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button onClick={() => window.location.reload()} className="ml-2 underline">
              Reintentar
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No hay doctores registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Nombre</th>
                  <th className="py-2">Especialidad</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Teléfono</th>
                  <th className="py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium">Dr. {d.nombre} {d.apellido}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        {d.especialidad}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{d.email || "—"}</td>
                    <td className="py-3 text-gray-600">{d.telefono || "—"}</td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/doctores/${d.id}/editar`}
                          className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Editar
                        </Link>
                        <DeleteButton action={() => handleDelete(d.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}