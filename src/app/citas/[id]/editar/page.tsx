import Link from "next/link";
import { notFound } from "next/navigation";
import { getCita, listPacientes, listDoctores } from "@/lib/db";
import { CitaForm } from "@/features/citas/components/CitaForm";
import { updateCitaAction } from "@/features/citas/actions/citaActions";

export default async function EditarCitaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cita = await getCita(id);
  if (!cita) notFound();
  const pacientes = await listPacientes();
  const doctores = await listDoctores();

  const action = updateCitaAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/citas" className="text-sm text-blue-600 hover:underline">
          ← Volver
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Editar cita</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <CitaForm
          action={action}
          pacientes={pacientes}
          doctores={doctores}
          initial={cita}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}