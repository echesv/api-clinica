import Link from "next/link";
import { PacienteForm } from "@/features/pacientes/components/PacienteForm";
import { createPacienteAction } from "@/features/pacientes/actions/pacienteActions";

export default function NuevoPacientePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/pacientes" className="text-sm text-blue-600 hover:underline">
          ← Volver
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nuevo paciente</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <PacienteForm action={createPacienteAction} submitLabel="Crear paciente" />
      </div>
    </div>
  );
}