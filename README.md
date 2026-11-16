# App Clínica

Sistema básico de administración de una clínica construido con **Next.js 16** (App Router) y **TypeScript**.

## Funcionalidades

- **Dashboard**: resumen con contadores y próximas citas.
- **Pacientes**: CRUD completo.
- **Doctores**: CRUD completo.
- **Citas**: CRUD completo con cambio de estado (programada / completada / cancelada).
- **Historial de consultas**: registro de fecha, motivo y notas breves de cada visita, vinculado a paciente (y doctor opcional).

## Tecnologías

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Persistencia en Supabase (PostgreSQL)
- Manejo de estado con hooks de React (`useState`, `useEffect`)
- Estados de carga (loading UI) y manejo de errores (error UI)
- Diseño responsive (móvil y escritorio)

## Configuración de Supabase

1. En el dashboard de Supabase, copia la **Project URL** y la **anon public key**.
2. Crea un archivo `.env.local` en la raíz del proyecto (puedes copiar `.env.local.example`):

```bash
cp .env.local.example .env.local
```

3. Completa las variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

4. Ejecuta el script `supabase/schema.sql` en el **SQL Editor** de Supabase para crear las tablas y políticas RLS.

## Ejecución

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
  app/              # rutas (App Router)
  components/       # UI y layout compartidos
  features/         # módulos por entidad (pacientes, doctores, citas)
  lib/              # acceso a datos (db.ts)
  types/            # tipos compartidos
```