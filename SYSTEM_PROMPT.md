# System Prompt — App Clínica

> Este archivo define las reglas, convenciones y guía paso a paso para trabajar en el proyecto **app-clinica**. Debe leerse antes de realizar cualquier cambio.

---

## 1. Contexto del proyecto

- **Nombre**: app-clinica
- **Propósito**: Sistema básico de administración de una clínica (pacientes, doctores, citas, historial de consultas).
- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Persistencia**: Supabase (PostgreSQL). Acceso vía `src/lib/supabase/server.ts` y `src/lib/db.ts`. Schema en `supabase/schema.sql`.
- **Idioma de la UI**: Español.
- **Directorio de trabajo**: `/Applications/XAMPP/xamppfiles/htdocs/Bootcamp-FSJ35/app-clinica`.

---

## 2. Reglas generales (siempre aplicar)

1. **No inventar APIs de Next.js**. Esta versión (16.x) tiene cambios respecto a versiones anteriores. Antes de usar una API nueva, consultar `node_modules/next/dist/docs/`.
2. **TypeScript estricto**. No usar `any` salvo justificación. Tipar props, estados y retornos.
3. **Server Components por defecto**. Solo añadir `"use client"` cuando se necesite interactividad (eventos, hooks de estado/efecto).
4. **Server Actions** para mutaciones: archivos con `"use server"` en `src/features/*/actions/*Actions.ts`.
5. **No modificar `AGENTS.md`** el bloque auto-generado (`BEGIN:nextjs-agent-rules`). Las reglas del proyecto viven en este archivo.
6. **Estilos con Tailwind CSS** únicamente. Evitar CSS custom salvo en `globals.css`.
7. **Nomenclatura en español** para entidades de dominio (paciente, doctor, cita). Código (variables, funciones, componentes) en inglés o español consistente con el existente.
8. **No commitear `data/`** (está en `.gitignore`).
9. **Validar entrada** en Server Actions (campos obligatorios, trim).
10. **Revalidar rutas** con `revalidatePath` tras cada mutación.

---

## 3. Estructura de carpetas

```
src/
  app/                          # Rutas (App Router)
    layout.tsx                  # Layout raíz (sidebar + main)
    page.tsx                    # Dashboard
    pacientes/
      page.tsx                  # Listado
      nuevo/page.tsx            # Creación
      [id]/editar/page.tsx      # Edición
    doctores/                   # (misma estructura)
    citas/                      # (misma estructura)
    consultas/                  # (misma estructura) — historial de consultas
  components/
    ui/                         # Componentes UI reutilizables
    layout/                     # Sidebar, etc.
  features/
    pacientes/
      actions/pacienteActions.ts
      components/PacienteForm.tsx
      types/                    # (opcional)
    doctores/
    citas/
    consultas/
      actions/consultaActions.ts
      components/ConsultaForm.tsx
  lib/
    db.ts                       # Acceso a datos (CRUD)
  types/
    index.ts                    # Tipos compartidos (Paciente, Doctor, Cita, Consulta, DB)
```

### Regla de ubicación
- Un componente usado por una sola feature → `src/features/<feature>/components/`.
- Un componente usado por varias features → `src/components/`.
- Acceso a datos siempre a través de `src/lib/db.ts`. No leer/escribir el JSON directamente desde componentes.

---

## 4. Paso a paso: añadir una nueva entidad

Ejemplo: agregar "Consultas".

1. **Tipo**: añadir interfaz en `src/types/index.ts` y agregar array a `DB`.
2. **DB**: añadir funciones CRUD en `src/lib/db.ts` (list, get, create, update, delete).
3. **Actions**: crear `src/features/<entidad>/actions/<entidad>Actions.ts` con `"use server"`.
   - `createXAction(_prev, formData)`, `updateXAction(id, _prev, formData)`, `deleteXAction(id)`.
   - Validar campos obligatorios; retornar `{ error }` si falla.
   - Llamar `revalidatePath` para las rutas afectadas.
   - `redirect` tras crear/editar.
4. **Form component**: crear `src/features/<entidad>/components/XForm.tsx` con `"use client"` y `useActionState`.
5. **Páginas**:
   - `src/app/<entidad>/page.tsx` (listado)
   - `src/app/<entidad>/nuevo/page.tsx`
   - `src/app/<entidad>/<id>/editar/page.tsx`
6. **Navegación**: añadir entrada en `src/components/layout/Sidebar.tsx`.
7. **Dashboard**: añadir contador/tarjeta en `src/app/page.tsx` si aplica.
8. **Build**: ejecutar `npm run build` y `npm run lint` para verificar.

---

## 5. Paso a paso: modificar una entidad existente

1. Actualizar el tipo en `src/types/index.ts`.
2. Actualizar funciones CRUD en `src/lib/db.ts`.
3. Actualizar Server Actions (campos del formData).
4. Actualizar el Form component.
5. Actualizar las páginas de listado/edición si cambian columnas o campos.
6. Ejecutar build y lint.

---

## 6. Manejo de estado y UI (React hooks)

- Las páginas de listado son **Client Components** (`"use client"`) que cargan datos con `useEffect` y gestionan estado con `useState`:
  - `data`, `loading`, `error`, y `query` (búsqueda/filtro).
- Patrón estándar:

```tsx
const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let mounted = true;
  setLoading(true);
  setError(null);
  listAction()
    .then((d) => { if (mounted) setData(d); })
    .catch((e) => { if (mounted) setError(e?.message ?? "Error"); })
    .finally(() => { if (mounted) setLoading(false); });
  return () => { mounted = false; };
}, []);
```

- **Loading UI**: spinner centrado mientras `loading` es true; también existe `loading.tsx` a nivel de ruta.
- **Error UI**: bloque rojo con botón "Reintentar" (`window.location.reload()`); también existe `error.tsx` (error boundary) a nivel de ruta.
- **Búsqueda/filtro**: input controlado con `useState`, filtrado en cliente con `Array.filter`.

## 6b. Diseño responsive

- Mobile-first con Tailwind. Breakpoints: `sm:`, `md:`, `lg:`.
- Sidebar: barra superior con hamburger en móvil (`md:hidden`), sidebar fija con overlay; en escritorio (`md:static`) siempre visible.
- Tablas envueltas en `overflow-x-auto` para scroll horizontal en pantallas pequeñas.
- Formularios usan `grid grid-cols-1 sm:grid-cols-2`.
- Botones de acción usan `flex flex-col sm:flex-row` para apilar en móvil.

## 7. Convenciones de código

### Componentes
- Props tipadas con `type Props = { ... }`.
- Componentes de formulario son `"use client"` y usan `useActionState`.
- Componentes de listado son Server Components (async cuando leen datos).

### Server Actions
- Firma: `action(_prev: ActionState, formData: FormData)`.
- Retornar `{ error?: string }` en caso de fallo.
- Usar `redirect()` tras éxito (lanza excepción internamente, no poner código después).

### Rutas dinámicas
- En Next.js 16, `params` es una Promise: `const { id } = await params;`.

### Data fetching
- Leer datos directamente en Server Components llamando a `src/lib/db.ts`.
- Marcar páginas dinámicas con `export const dynamic = "force-dynamic"` cuando leen datos en runtime (ya está en el layout raíz).

### Estilos
- Tailwind utility classes. Paleta: azul (`blue-600`) primario, grises para texto secundario.
- Tarjetas: `rounded-xl border border-gray-200 bg-white p-6 shadow-sm`.

---

## 8. Comandos útiles

```bash
npm run dev      # desarrollo (http://localhost:3000)
npm run build    # build de producción
npm run start    # servir build
npm run lint     # eslint
```

---

## 9. Checklist antes de entregar un cambio

- [ ] `npm run build` pasa sin errores.
- [ ] `npm run lint` pasa sin warnings bloqueantes.
- [ ] No se introdujeron `any` injustificados.
- [ ] Las mutaciones revalidan las rutas afectadas.
- [ ] La UI está en español.
- [ ] Las páginas de listado manejan `loading` y `error` con UI adecuada.
- [ ] El diseño es responsive (móvil y escritorio).
- [ ] No se commiteó `data/` ni `.env.local`.

---

## 10. Notas de Next.js 16

- `params` y `searchParams` son Promises (await).
- Turbopack es el bundler por defecto.
- `cacheComponents` deshabilitado en este proyecto (ver `next.config.ts`) para mantener renderizado dinámico simple.
- Consultar `node_modules/next/dist/docs/` ante dudas de API.