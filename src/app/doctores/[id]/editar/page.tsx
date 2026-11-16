import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoctor } from "@/lib/db";
import { DoctorForm } from "@/features/doctores/components/DoctorForm";
import { updateDoctorAction } from "@/features/doctores/actions/doctorActions";

export default async function EditarDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = await getDoctor(id);
  if (!doctor) notFound();

  const action = updateDoctorAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/doctores" className="text-sm text-blue-600 hover:underline">
          ← Volver
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Editar doctor</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <DoctorForm action={action} initial={doctor} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}