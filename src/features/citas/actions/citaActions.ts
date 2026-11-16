"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCita, updateCita, deleteCita, listCitas, listPacientes, listDoctores } from "@/lib/db";
import type { EstadoCita } from "@/types";

export type ActionState = { error?: string; success?: boolean };

export async function listCitasAction() {
  const [citas, pacientes, doctores] = await Promise.all([
    listCitas(),
    listPacientes(),
    listDoctores(),
  ]);
  return { citas, pacientes, doctores };
}

export async function createCitaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const pacienteId = String(formData.get("pacienteId") ?? "").trim();
  const doctorId = String(formData.get("doctorId") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const hora = String(formData.get("hora") ?? "").trim();
  const motivo = String(formData.get("motivo") ?? "").trim();

  if (!pacienteId || !doctorId || !fecha || !hora) {
    return { error: "Paciente, doctor, fecha y hora son obligatorios." };
  }

  await createCita({ pacienteId, doctorId, fecha, hora, motivo, estado: "programada" });
  revalidatePath("/citas");
  revalidatePath("/");
  redirect("/citas");
}

export async function updateCitaAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const pacienteId = String(formData.get("pacienteId") ?? "").trim();
  const doctorId = String(formData.get("doctorId") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const hora = String(formData.get("hora") ?? "").trim();
  const motivo = String(formData.get("motivo") ?? "").trim();
  const estado = String(formData.get("estado") ?? "programada") as EstadoCita;

  if (!pacienteId || !doctorId || !fecha || !hora) {
    return { error: "Paciente, doctor, fecha y hora son obligatorios." };
  }

  const updated = await updateCita(id, { pacienteId, doctorId, fecha, hora, motivo, estado });
  if (!updated) return { error: "Cita no encontrada." };
  revalidatePath("/citas");
  revalidatePath("/");
  redirect("/citas");
}

export async function updateCitaEstadoAction(id: string, estado: EstadoCita) {
  await updateCita(id, { estado });
  revalidatePath("/citas");
  revalidatePath("/");
}

export async function deleteCitaAction(id: string) {
  await deleteCita(id);
  revalidatePath("/citas");
  revalidatePath("/");
}