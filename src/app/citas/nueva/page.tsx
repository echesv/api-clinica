import Link from "next/link";
import { listPacientes, listDoctores } from "@/lib/db";
import { CitaForm } from "@/features/citas/components/CitaForm";
import { createCitaAction } from "@/features/citas/actions/citaActions";

export default async function NuevaCitaPage() {
  const pacientes = await listPacientes();
  const doctores = await listDoctores();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/citas" className="text-sm text-blue-600 hover:underline">
          ← Volver
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nueva cita</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <CitaForm
          action={createCitaAction}
          pacientes={pacientes}
          doctores={doctores}
          submitLabel="Crear cita"
        />
      </div>
    </div>
  );
}