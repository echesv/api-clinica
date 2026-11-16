"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCitasAction } from "@/features/citas/actions/citaActions";
import { deleteCitaAction } from "@/features/citas/actions/citaActions";
import { Card } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { CitaEstadoSelect } from "@/features/citas/components/CitaEstadoSelect";
import type { Cita, Paciente, Doctor } from "@/types";

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    listCitasAction()
      .then((data) => {
        if (mounted) {
          setCitas(data.citas);
          setPacientes(data.pacientes);
          setDoctores(data.doctores);
        }
      })
      .catch((e) => {
        if (mounted) setError(e?.message ?? "Error al cargar citas");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const byP = (id: string) => pacientes.find((p) => p.id === id);
  const byD = (id: string) => doctores.find((d) => d.id === id);

  const filtered = citas.filter((c) => {
    const q = query.toLowerCase();
    const p = byP(c.pacienteId);
    const d = byD(c.doctorId);
    return (
      !q ||
      (p ? `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) : false) ||
      (d ? `dr. ${d.nombre} ${d.apellido}`.toLowerCase().includes(q) : false) ||
      c.motivo.toLowerCase().includes(q) ||
      c.fecha.includes(q)
    );
  });

  async function handleDelete(id: string) {
    await deleteCitaAction(id);
    setCitas((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Citas</h1>
          <p className="text-sm text-gray-500">{citas.length} registradas</p>
        </div>
        <Link
          href="/citas/nueva"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nueva cita
        </Link>
      </div>

      <input
        type="search"
        placeholder="Buscar por paciente, doctor, motivo o fecha..."
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
          <p className="text-sm text-gray-500">No hay citas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Fecha</th>
                  <th className="py-2">Hora</th>
                  <th className="py-2">Paciente</th>
                  <th className="py-2">Doctor</th>
                  <th className="py-2">Motivo</th>
                  <th className="py-2">Estado</th>
                  <th className="py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const p = byP(c.pacienteId);
                  const d = byD(c.doctorId);
                  return (
                    <tr key={c.id} className="border-b border-gray-100">
                      <td className="py-3">{c.fecha}</td>
                      <td className="py-3">{c.hora}</td>
                      <td className="py-3 font-medium">{p ? `${p.nombre} ${p.apellido}` : "—"}</td>
                      <td className="py-3">{d ? `Dr. ${d.nombre} ${d.apellido}` : "—"}</td>
                      <td className="py-3 text-gray-600">{c.motivo || "—"}</td>
                      <td className="py-3">
                        <CitaEstadoSelect id={c.id} estado={c.estado} />
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/citas/${c.id}/editar`}
                            className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                          >
                            Editar
                          </Link>
                          <DeleteButton action={() => handleDelete(c.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}