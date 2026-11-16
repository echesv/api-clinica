"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPacientesAction } from "@/features/pacientes/actions/pacienteActions";
import { deletePacienteAction } from "@/features/pacientes/actions/pacienteActions";
import { Card } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { Paciente } from "@/types";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    listPacientesAction()
      .then((data) => {
        if (mounted) setPacientes(data);
      })
      .catch((e) => {
        if (mounted) setError(e?.message ?? "Error al cargar pacientes");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = pacientes.filter((p) => {
    const q = query.toLowerCase();
    return (
      !q ||
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.telefono || "").includes(q)
    );
  });

  async function handleDelete(id: string) {
    await deletePacienteAction(id);
    setPacientes((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <p className="text-sm text-gray-500">{pacientes.length} registrados</p>
        </div>
        <Link
          href="/pacientes/nuevo"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nuevo paciente
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Buscar por nombre, email o teléfono..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:max-w-md"
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 underline"
            >
              Reintentar
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No hay pacientes registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Nombre</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Teléfono</th>
                  <th className="py-2">Nacimiento</th>
                  <th className="py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium">
                      {p.nombre} {p.apellido}
                    </td>
                    <td className="py-3 text-gray-600">{p.email || "—"}</td>
                    <td className="py-3 text-gray-600">{p.telefono || "—"}</td>
                    <td className="py-3 text-gray-600">{p.fechaNacimiento || "—"}</td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/pacientes/${p.id}/editar`}
                          className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Editar
                        </Link>
                        <DeleteButton action={() => handleDelete(p.id)} />
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