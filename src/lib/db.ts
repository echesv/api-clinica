import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Paciente, Doctor, Cita, Consulta, EstadoCita, DB } from "@/types";

// Pacientes
export async function listPacientes(): Promise<Paciente[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .order("apellido", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toPaciente);
}
export async function getPaciente(id: string): Promise<Paciente | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("pacientes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toPaciente(data) : undefined;
}
export async function createPaciente(input: Omit<Paciente, "id" | "createdAt">): Promise<Paciente> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pacientes")
    .insert({
      nombre: input.nombre,
      apellido: input.apellido,
      email: input.email,
      telefono: input.telefono,
      fecha_nacimiento: input.fechaNacimiento || null,
      direccion: input.direccion,
    })
    .select()
    .single();
  if (error) throw error;
  return toPaciente(data);
}
export async function updatePaciente(
  id: string,
  input: Partial<Omit<Paciente, "id" | "createdAt">>
): Promise<Paciente | null> {
  const supabase = await createSupabaseServerClient();
  const payload: Record<string, unknown> = {};
  if (input.nombre !== undefined) payload.nombre = input.nombre;
  if (input.apellido !== undefined) payload.apellido = input.apellido;
  if (input.email !== undefined) payload.email = input.email;
  if (input.telefono !== undefined) payload.telefono = input.telefono;
  if (input.fechaNacimiento !== undefined) payload.fecha_nacimiento = input.fechaNacimiento || null;
  if (input.direccion !== undefined) payload.direccion = input.direccion;
  const { data, error } = await supabase.from("pacientes").update(payload).eq("id", id).select().maybeSingle();
  if (error) throw error;
  return data ? toPaciente(data) : null;
}
export async function deletePaciente(id: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("pacientes").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Doctores
export async function listDoctores(): Promise<Doctor[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("doctores")
    .select("*")
    .order("apellido", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toDoctor);
}
export async function getDoctor(id: string): Promise<Doctor | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("doctores").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toDoctor(data) : undefined;
}
export async function createDoctor(input: Omit<Doctor, "id" | "createdAt">): Promise<Doctor> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("doctores")
    .insert({
      nombre: input.nombre,
      apellido: input.apellido,
      especialidad: input.especialidad,
      email: input.email,
      telefono: input.telefono,
    })
    .select()
    .single();
  if (error) throw error;
  return toDoctor(data);
}
export async function updateDoctor(
  id: string,
  input: Partial<Omit<Doctor, "id" | "createdAt">>
): Promise<Doctor | null> {
  const supabase = await createSupabaseServerClient();
  const payload: Record<string, unknown> = {};
  if (input.nombre !== undefined) payload.nombre = input.nombre;
  if (input.apellido !== undefined) payload.apellido = input.apellido;
  if (input.especialidad !== undefined) payload.especialidad = input.especialidad;
  if (input.email !== undefined) payload.email = input.email;
  if (input.telefono !== undefined) payload.telefono = input.telefono;
  const { data, error } = await supabase.from("doctores").update(payload).eq("id", id).select().maybeSingle();
  if (error) throw error;
  return data ? toDoctor(data) : null;
}
export async function deleteDoctor(id: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("doctores").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Citas
export async function listCitas(): Promise<Cita[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("citas").select("*").order("fecha", { ascending: true }).order("hora", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toCita);
}
export async function getCita(id: string): Promise<Cita | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("citas").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toCita(data) : undefined;
}
export async function createCita(input: Omit<Cita, "id" | "createdAt">): Promise<Cita> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("citas")
    .insert({
      paciente_id: input.pacienteId,
      doctor_id: input.doctorId,
      fecha: input.fecha,
      hora: input.hora,
      motivo: input.motivo,
      estado: input.estado,
    })
    .select()
    .single();
  if (error) throw error;
  return toCita(data);
}
export async function updateCita(
  id: string,
  input: Partial<Omit<Cita, "id" | "createdAt">>
): Promise<Cita | null> {
  const supabase = await createSupabaseServerClient();
  const payload: Record<string, unknown> = {};
  if (input.pacienteId !== undefined) payload.paciente_id = input.pacienteId;
  if (input.doctorId !== undefined) payload.doctor_id = input.doctorId;
  if (input.fecha !== undefined) payload.fecha = input.fecha;
  if (input.hora !== undefined) payload.hora = input.hora;
  if (input.motivo !== undefined) payload.motivo = input.motivo;
  if (input.estado !== undefined) payload.estado = input.estado;
  const { data, error } = await supabase.from("citas").update(payload).eq("id", id).select().maybeSingle();
  if (error) throw error;
  return data ? toCita(data) : null;
}
export async function deleteCita(id: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("citas").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Consultas
export async function listConsultas(): Promise<Consulta[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("consultas")
    .select("*")
    .order("fecha", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toConsulta);
}
export async function getConsulta(id: string): Promise<Consulta | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("consultas").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toConsulta(data) : undefined;
}
export async function createConsulta(input: Omit<Consulta, "id" | "createdAt">): Promise<Consulta> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("consultas")
    .insert({
      paciente_id: input.pacienteId,
      doctor_id: input.doctorId,
      fecha: input.fecha,
      motivo: input.motivo,
      notas: input.notas,
    })
    .select()
    .single();
  if (error) throw error;
  return toConsulta(data);
}
export async function updateConsulta(
  id: string,
  input: Partial<Omit<Consulta, "id" | "createdAt">>
): Promise<Consulta | null> {
  const supabase = await createSupabaseServerClient();
  const payload: Record<string, unknown> = {};
  if (input.pacienteId !== undefined) payload.paciente_id = input.pacienteId;
  if (input.doctorId !== undefined) payload.doctor_id = input.doctorId;
  if (input.fecha !== undefined) payload.fecha = input.fecha;
  if (input.motivo !== undefined) payload.motivo = input.motivo;
  if (input.notas !== undefined) payload.notas = input.notas;
  const { data, error } = await supabase.from("consultas").update(payload).eq("id", id).select().maybeSingle();
  if (error) throw error;
  return data ? toConsulta(data) : null;
}
export async function deleteConsulta(id: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("consultas").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Mappers
function asString(v: unknown): string {
  return (v ?? "") as string;
}

function toPaciente(row: Record<string, unknown>): Paciente {
  return {
    id: asString(row.id),
    nombre: asString(row.nombre),
    apellido: asString(row.apellido),
    email: asString(row.email),
    telefono: asString(row.telefono),
    fechaNacimiento: asString(row.fecha_nacimiento),
    direccion: asString(row.direccion),
    createdAt: asString(row.created_at),
  };
}
function toDoctor(row: Record<string, unknown>): Doctor {
  return {
    id: asString(row.id),
    nombre: asString(row.nombre),
    apellido: asString(row.apellido),
    especialidad: asString(row.especialidad),
    email: asString(row.email),
    telefono: asString(row.telefono),
    createdAt: asString(row.created_at),
  };
}
function toCita(row: Record<string, unknown>): Cita {
  return {
    id: asString(row.id),
    pacienteId: asString(row.paciente_id),
    doctorId: asString(row.doctor_id),
    fecha: asString(row.fecha),
    hora: asString(row.hora),
    motivo: asString(row.motivo),
    estado: asString(row.estado) as EstadoCita,
    createdAt: asString(row.created_at),
  };
}
function toConsulta(row: Record<string, unknown>): Consulta {
  return {
    id: asString(row.id),
    pacienteId: asString(row.paciente_id),
    doctorId: (row.doctor_id as string | null) ?? null,
    fecha: asString(row.fecha),
    motivo: asString(row.motivo),
    notas: asString(row.notas),
    createdAt: asString(row.created_at),
  };
}

// Compatibilidad: DB agregada (no persistente local)
export async function readDB(): Promise<DB> {
  const [pacientes, doctores, citas, consultas] = await Promise.all([
    listPacientes(),
    listDoctores(),
    listCitas(),
    listConsultas(),
  ]);
  return { pacientes, doctores, citas, consultas };
}