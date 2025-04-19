import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserType = {
  id: string;
  nome: string;
  email: string;
  perfil: string[]; // Mantemos a informação dos perfis, mas não vamos usá-los diretamente no estado
  modalidade: string | null;
  posicao: string | null;
  escaloes: string[];
  foto: string | null;
};

type AuthContextType = {
  user: UserType | null;
  perfilAtivo: string | null;
  setPerfilAtivo: (perfil: string) => void;
  setUser: (user: UserType | null) => void;
  login: (user: any) => void;
  logout: () => void;
  loading: boolean;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
const [perfilAtivo, setPerfilAtivo] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const storedPerfil = localStorage.getItem("perfilAtivo");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  if (storedPerfil) {
    setPerfilAtivo(storedPerfil);
  }

  setLoading(false);
}, []);



const login = (userData: any) => {
  let escaloes: string[] = [];
  if (Array.isArray(userData["escalão"])) {
    escaloes = userData["escalão"];
  } else if (typeof userData["escalão"] === "string" && userData["escalão"].trim() !== "-") {
    escaloes = [userData["escalão"]];
  }

  const perfisOriginais = Array.isArray(userData.perfil) ? userData.perfil : [userData.perfil];

  // 🔁 Convertendo "Treinador" → "Treinador Basquetebol" e "Atleta" → "Atleta Basquetebol"
  const perfisCompletos = perfisOriginais
  .map((perfil: string) => {
    const modalidade = (userData.modalidade || "").trim();

    if (perfil === "Treinador") {
      return modalidade && modalidade !== "-" ? `Treinador ${modalidade}` : null;
    }

    if (perfil === "Atleta") {
      return modalidade && modalidade !== "-" ? `Atleta ${modalidade}` : null;
    }

    if (
      perfil === "Fisioterapeuta" ||
      perfil === "Preparador Físico" ||
      perfil === "Analista" ||
      perfil === "Administrador" ||
      perfil === "Coordenador Hóquei"
    ) {
      return perfil;
    }

    return null;
  })
  .filter(Boolean); // remove os null

  
  const userComEscaloes: UserType = {
    id: userData.id || '',
    nome: userData.nome || '',
    email: userData.email || '',
    perfil: perfisCompletos,
    modalidade: userData.modalidade || null,
    posicao: userData.posicao || null,
    escaloes: escaloes,
    foto: userData.foto || '/avatar.png',
  };

  console.log("🧾 Utilizador final a guardar:", userComEscaloes);

  setUser(userComEscaloes);
setPerfilAtivo(perfisCompletos[0]); // importante
localStorage.setItem("user", JSON.stringify(userComEscaloes));
localStorage.setItem("perfilAtivo", perfisCompletos[0]); // importante
};



const logout = () => {
  setUser(null);
  setPerfilAtivo(null); // adiciona isto
  localStorage.removeItem("user");
  localStorage.removeItem("perfilAtivo"); // remove o perfil ativo também
};


  return (
    <AuthContext.Provider value={{ user, perfilAtivo, setPerfilAtivo, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
