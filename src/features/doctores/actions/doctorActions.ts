"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createDoctor, updateDoctor, deleteDoctor, listDoctores } from "@/lib/db";

export type ActionState = { error?: string; success?: boolean };

export async function listDoctoresAction() {
  return await listDoctores();
}

export async function createDoctorAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const especialidad = String(formData.get("especialidad") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();

  if (!nombre || !apellido || !especialidad) {
    return { error: "Nombre, apellido y especialidad son obligatorios." };
  }

  await createDoctor({ nombre, apellido, especialidad, email, telefono });
  revalidatePath("/doctores");
  revalidatePath("/");
  redirect("/doctores");
}

export async function updateDoctorAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const especialidad = String(formData.get("especialidad") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();

  if (!nombre || !apellido || !especialidad) {
    return { error: "Nombre, apellido y especialidad son obligatorios." };
  }

  const updated = await updateDoctor(id, { nombre, apellido, especialidad, email, telefono });
  if (!updated) return { error: "Doctor no encontrado." };
  revalidatePath("/doctores");
  revalidatePath(`/doctores/${id}`);
  revalidatePath("/");
  redirect("/doctores");
}

export async function deleteDoctorAction(id: string) {
  await deleteDoctor(id);
  revalidatePath("/doctores");
  revalidatePath("/citas");
  revalidatePath("/");
}