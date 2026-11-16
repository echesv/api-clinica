import Link from "next/link";
import { listPacientes, listDoctores } from "@/lib/db";
import { ConsultaForm } from "@/features/consultas/components/ConsultaForm";
import { createConsultaAction } from "@/features/consultas/actions/consultaActions";

export default async function NuevaConsultaPage() {
  const pacientes = await listPacientes();
  const doctores = await listDoctores();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/consultas" className="text-sm text-blue-600 hover:underline">
          ← Volver
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nueva consulta</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ConsultaForm
          action={createConsultaAction}
          pacientes={pacientes}
          doctores={doctores}
          submitLabel="Crear consulta"
        />
      </div>
    </div>
  );
}