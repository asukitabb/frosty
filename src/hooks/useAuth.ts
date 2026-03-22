import { useMemo, useState } from "react";

export interface CashierSession {
  id: string;
  name: string;
  role: "cashier" | "admin";
}

/**
 * Sesión de caja mínima (extensible a JWT / SSO).
 */
export function useAuth() {
  const [session] = useState<CashierSession | null>({
    id: "u1",
    name: "Caja Frosty",
    role: "cashier",
  });

  return useMemo(
    () => ({
      session,
      isAuthenticated: session !== null,
    }),
    [session]
  );
}
