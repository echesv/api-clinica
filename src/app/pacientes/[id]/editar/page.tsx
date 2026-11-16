import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaciente } from "@/lib/db";
import { PacienteForm } from "@/features/pacientes/components/PacienteForm";
import { updatePacienteAction } from "@/features/pacientes/actions/pacienteActions";

export default async function EditarPacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await getPaciente(id);
  if (!paciente) notFound();

  const action = updatePacienteAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/pacientes" className="text-sm text-blue-600 hover:underline">
          ← Volver
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Editar paciente</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <PacienteForm action={action} initial={paciente} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}