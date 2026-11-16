"use client";

import { useTransition } from "react";
import { updateCitaEstadoAction } from "@/features/citas/actions/citaActions";

const colors: Record<string, string> = {
  programada: "bg-blue-100 text-blue-700",
  completada: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
};

export function CitaEstadoSelect({ id, estado }: { id: string; estado: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      defaultValue={estado}
      disabled={pending}
      onChange={(e) => {
        startTransition(() => {
          void updateCitaEstadoAction(id, e.target.value as "programada" | "completada" | "cancelada");
        });
      }}
      className={`rounded-full px-2 py-1 text-xs font-medium ${colors[estado]}`}
    >
      <option value="programada">programada</option>
      <option value="completada">completada</option>
      <option value="cancelada">cancelada</option>
    </select>
  );
}