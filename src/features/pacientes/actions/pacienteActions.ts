"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPaciente,
  updatePaciente,
  deletePaciente,
  listPacientes,
} from "@/lib/db";

export type ActionState = { error?: string; success?: boolean };

export async function listPacientesAction() {
  return await listPacientes();
}

export async function createPacienteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const fechaNacimiento = String(formData.get("fechaNacimiento") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();

  if (!nombre || !apellido) {
    return { error: "Nombre y apellido son obligatorios." };
  }

  await createPaciente({ nombre, apellido, email, telefono, fechaNacimiento, direccion });
  revalidatePath("/pacientes");
  revalidatePath("/");
  redirect("/pacientes");
}

export async function updatePacienteAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const fechaNacimiento = String(formData.get("fechaNacimiento") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();

  if (!nombre || !apellido) {
    return { error: "Nombre y apellido son obligatorios." };
  }

  const updated = await updatePaciente(id, { nombre, apellido, email, telefono, fechaNacimiento, direccion });
  if (!updated) return { error: "Paciente no encontrado." };
  revalidatePath("/pacientes");
  revalidatePath(`/pacientes/${id}`);
  revalidatePath("/");
  redirect("/pacientes");
}

export async function deletePacienteAction(id: string) {
  await deletePaciente(id);
  revalidatePath("/pacientes");
  revalidatePath("/citas");
  revalidatePath("/");
}