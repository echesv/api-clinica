import Link from "next/link";
import { DoctorForm } from "@/features/doctores/components/DoctorForm";
import { createDoctorAction } from "@/features/doctores/actions/doctorActions";

export default function NuevoDoctorPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/doctores" className="text-sm text-blue-600 hover:underline">
          ← Volver
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nuevo doctor</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <DoctorForm action={createDoctorAction} submitLabel="Crear doctor" />
      </div>
    </div>
  );
}