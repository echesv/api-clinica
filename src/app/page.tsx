"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPacientesAction } from "@/features/pacientes/actions/pacienteActions";
import { listDoctoresAction } from "@/features/doctores/actions/doctorActions";
import { listCitasAction } from "@/features/citas/actions/citaActions";
import { listConsultasAction } from "@/features/consultas/actions/consultaActions";
import { Card } from "@/components/ui/Button";
import type { Paciente, Doctor, Cita, Consulta } from "@/types";

export default function DashboardPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      listPacientesAction(),
      listDoctoresAction(),
      listCitasAction(),
      listConsultasAction(),
    ])
      .then(([ps, ds, cs, cons]) => {
        if (mounted) {
          setPacientes(ps);
          setDoctores(ds);
          setCitas(cs.citas);
          setConsultas(cons.consultas);
        }
      })
      .catch((e) => {
        if (mounted) setError(e?.message ?? "Error al cargar el dashboard");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const hoy = new Date().toISOString().slice(0, 10);
  const citasHoy = citas.filter((c) => c.fecha === hoy);
  const proximas = citas
    .filter((c) => c.fecha >= hoy && c.estado === "programada")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen de la clínica</p>
      </div>

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
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <p className="text-sm text-gray-500">Pacientes</p>
              <p className="text-3xl font-bold text-blue-700">{pacientes.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Doctores</p>
              <p className="text-3xl font-bold text-green-700">{doctores.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Citas totales</p>
              <p className="text-3xl font-bold text-purple-700">{citas.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Citas hoy</p>
              <p className="text-3xl font-bold text-orange-700">{citasHoy.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Consultas</p>
              <p className="text-3xl font-bold text-teal-700">{consultas.length}</p>
            </Card>
          </div>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Próximas citas</h2>
              <Link href="/citas" className="text-sm text-blue-600 hover:underline">
                Ver todas
              </Link>
            </div>
            {proximas.length === 0 ? (
              <p className="text-sm text-gray-500">No hay citas programadas.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {proximas.map((c) => {
                  const p = pacientes.find((x) => x.id === c.pacienteId);
                  const d = doctores.find((x) => x.id === c.doctorId);
                  return (
                    <li key={c.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">
                          {p ? `${p.nombre} ${p.apellido}` : "Paciente"}{" "}
                          <span className="text-gray-400">con</span>{" "}
                          {d ? `Dr. ${d.nombre} ${d.apellido}` : "Doctor"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {c.fecha} · {c.hora} · {c.motivo || "Sin motivo"}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        {c.estado}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}