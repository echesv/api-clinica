import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <span className="text-5xl">🔍</span>
      <h2 className="text-xl font-bold text-gray-800">Página no encontrada</h2>
      <p className="text-sm text-gray-500">La ruta que buscas no existe.</p>
      <Link href="/" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Volver al inicio
      </Link>
    </div>
  );
}