import { useSyncExternalStore } from "react";
import { useServices } from "@/context/ServicesContext";

/** Suscripción al inventario para re-renderizar el dashboard cuando cambie el Kardex o el stock. */
export function useInventorySnapshot() {
  const { inventory } = useServices();
  return useSyncExternalStore(
    (onStoreChange) => inventory.subscribe(onStoreChange),
    () => inventory.getSnapshot(),
    () => inventory.getSnapshot()
  );
}
