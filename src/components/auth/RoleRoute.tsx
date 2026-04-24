import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import type { Role } from "@/lib/api";

export const DEFAULT_ROLE_HOME: Record<Role, string> = {
  FARMER: "/farmer",
  PROCESSOR: "/processor",
  LOGISTICS: "/logistics",
  RETAILER: "/retailer",
  ADMIN: "/admin",
  CONSUMER: "/scan",
};

interface RoleRouteProps {
  allow: Role[];
  children: ReactNode;
}

export function RoleRoute({ allow, children }: RoleRouteProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) {
    return <Navigate to={DEFAULT_ROLE_HOME[user.role]} replace />;
  }
  return <>{children}</>;
}
