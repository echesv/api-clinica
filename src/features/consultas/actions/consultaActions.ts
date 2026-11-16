"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createConsulta, updateConsulta, deleteConsulta, listConsultas, listPacientes, listDoctores } from "@/lib/db";

export type ActionState = { error?: string; success?: boolean };

export async function listConsultasAction() {
  const [consultas, pacientes, doctores] = await Promise.all([
    listConsultas(),
    listPacientes(),
    listDoctores(),
  ]);
  return { consultas, pacientes, doctores };
}

export async function createConsultaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const pacienteId = String(formData.get("pacienteId") ?? "").trim();
  const doctorId = String(formData.get("doctorId") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const motivo = String(formData.get("motivo") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();

  if (!pacienteId || !fecha || !motivo) {
    return { error: "Paciente, fecha y motivo son obligatorios." };
  }

  await createConsulta({ pacienteId, doctorId: doctorId || null, fecha, motivo, notas });
  revalidatePath("/consultas");
  revalidatePath("/");
  redirect("/consultas");
}

export async function updateConsultaAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const pacienteId = String(formData.get("pacienteId") ?? "").trim();
  const doctorId = String(formData.get("doctorId") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const motivo = String(formData.get("motivo") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();

  if (!pacienteId || !fecha || !motivo) {
    return { error: "Paciente, fecha y motivo son obligatorios." };
  }

  const updated = await updateConsulta(id, { pacienteId, doctorId: doctorId || null, fecha, motivo, notas });
  if (!updated) return { error: "Consulta no encontrada." };
  revalidatePath("/consultas");
  revalidatePath("/");
  redirect("/consultas");
}

export async function deleteConsultaAction(id: string) {
  await deleteConsulta(id);
  revalidatePath("/consultas");
  revalidatePath("/");
}