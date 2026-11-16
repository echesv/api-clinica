-- Schema para App Clínica
-- Ejecutar en el SQL Editor de Supabase

create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  email text,
  telefono text,
  fecha_nacimiento date,
  direccion text,
  created_at timestamptz not null default now()
);

create table if not exists doctores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  especialidad text not null,
  email text,
  telefono text,
  created_at timestamptz not null default now()
);

create table if not exists citas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  doctor_id uuid not null references doctores(id) on delete cascade,
  fecha date not null,
  hora time not null,
  motivo text,
  estado text not null default 'programada',
  created_at timestamptz not null default now()
);

create table if not exists consultas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  doctor_id uuid references doctores(id) on delete set null,
  fecha date not null,
  motivo text not null,
  notas text,
  created_at timestamptz not null default now()
);

-- RLS: habilitar acceso público para desarrollo (ajustar en producción)
alter table pacientes enable row level security;
alter table doctores enable row level security;
alter table citas enable row level security;
alter table consultas enable row level security;

create policy "public all pacientes" on pacientes for all using (true) with check (true);
create policy "public all doctores" on doctores for all using (true) with check (true);
create policy "public all citas" on citas for all using (true) with check (true);
create policy "public all consultas" on consultas for all using (true) with check (true);