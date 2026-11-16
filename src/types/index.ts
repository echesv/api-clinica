export type Paciente = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  createdAt: string;
};

export type Doctor = {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  email: string;
  telefono: string;
  createdAt: string;
};

export type EstadoCita = "programada" | "completada" | "cancelada";

export type Cita = {
  id: string;
  pacienteId: string;
  doctorId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
  createdAt: string;
};

export type Consulta = {
  id: string;
  pacienteId: string;
  doctorId: string | null;
  fecha: string;
  motivo: string;
  notas: string;
  createdAt: string;
};

export type DB = {
  pacientes: Paciente[];
  doctores: Doctor[];
  citas: Cita[];
  consultas: Consulta[];
};