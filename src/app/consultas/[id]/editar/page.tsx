import Link from "next/link";
import { notFound } from "next/navigation";
import { getConsulta, listPacientes, listDoctores } from "@/lib/db";
import { ConsultaForm } from "@/features/consultas/components/ConsultaForm";
import { updateConsultaAction } from "@/features/consultas/actions/consultaActions";

export default async function EditarConsultaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const consulta = await getConsulta(id);
  if (!consulta) notFound();
  const pacientes = await listPacientes();
  const doctores = await listDoctores();

  const action = updateConsultaAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/consultas" className="text-sm text-blue-600 hover:underline">
          ← Volver
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Editar consulta</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ConsultaForm
          action={action}
          pacientes={pacientes}
          doctores={doctores}
          initial={consulta}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}