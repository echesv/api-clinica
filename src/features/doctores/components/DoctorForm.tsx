"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/features/doctores/actions/doctorActions";
import type { Doctor } from "@/types";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: Doctor;
  submitLabel?: string;
};

export function DoctorForm({ action, initial, submitLabel = "Guardar" }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre *</label>
          <Input name="nombre" defaultValue={initial?.nombre} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Apellido *</label>
          <Input name="apellido" defaultValue={initial?.apellido} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Especialidad *</label>
          <Input name="especialidad" defaultValue={initial?.especialidad} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input type="email" name="email" defaultValue={initial?.email} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Teléfono</label>
          <Input name="telefono" defaultValue={initial?.telefono} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}