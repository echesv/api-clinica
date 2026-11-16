"use client";

import { useActionState } from "react";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/features/citas/actions/citaActions";
import type { Cita, Paciente, Doctor } from "@/types";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  pacientes: Paciente[];
  doctores: Doctor[];
  initial?: Cita;
  submitLabel?: string;
};

const estados = ["programada", "completada", "cancelada"] as const;

export function CitaForm({ action, pacientes, doctores, initial, submitLabel = "Guardar" }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Paciente *</label>
          <Select name="pacienteId" defaultValue={initial?.pacienteId} required>
            <option value="">Seleccionar paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellido}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Doctor *</label>
          <Select name="doctorId" defaultValue={initial?.doctorId} required>
            <option value="">Seleccionar doctor</option>
            {doctores.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.nombre} {d.apellido} — {d.especialidad}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Fecha *</label>
          <Input type="date" name="fecha" defaultValue={initial?.fecha} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Hora *</label>
          <Input type="time" name="hora" defaultValue={initial?.hora} required />
        </div>
        {initial && (
          <div>
            <label className="mb-1 block text-sm font-medium">Estado</label>
            <Select name="estado" defaultValue={initial.estado}>
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Motivo</label>
        <Textarea name="motivo" defaultValue={initial?.motivo} rows={3} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}