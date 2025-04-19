import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

const PrivateRoute = ({ allowedRoles, children }: Props) => {
  const { user, perfilAtivo, loading } = useAuth();

  if (loading) {
    // Enquanto estiver a carregar, não retorna nada (podes meter spinner aqui se quiseres)
    return null;
  }

  // ⚠️ Após carregar, se ainda assim não houver user ou perfil, redireciona
  if (!user || !perfilAtivo) {
    return <Navigate to="/" replace />;
  }

  const autorizado = allowedRoles.some((role) => {
    const match = perfilAtivo.toLowerCase() === role.toLowerCase();
    console.log("🛡️ Comparando:", `"${perfilAtivo.toLowerCase()}"`, "com", `"${role.toLowerCase()}"`, "→", match);
    return match;
  });
  

  if (!autorizado) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
