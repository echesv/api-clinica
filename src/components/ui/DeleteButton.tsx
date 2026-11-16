"use client";

import { useTransition } from "react";
import { Button } from "./Button";

export function DeleteButton({ action, label = "Eliminar" }: { action: () => Promise<void> | void; label?: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (confirm("¿Seguro que deseas eliminar este registro?")) {
          startTransition(() => {
            void action();
          });
        }
      }}
    >
      {pending ? "Eliminando..." : label}
    </Button>
  );
}