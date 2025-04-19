import React, { useState } from "react";
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom"; // Importando useLocation para pegar a rota atual
import { useAuth } from "./context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Medal,
  Group,
  ShieldCheck,
  Bell,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  HeartPulse,
  BarChart3,
  Briefcase,
  Trophy,
} from "lucide-react";


// No arquivo AdminLayout.tsx, adicione a entrada Modalidades no menu
const menuItems = [
  { name: "Painel", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Usuários", path: "/admin/usuarios", icon: <Users size={20} /> },
  { name: "Modalidades", path: "/admin/modalidades", icon: <Medal size={20} /> },
  { name: "Escalões", path: "/admin/escaloes", icon: <Group size={20} /> },
  { name: "Competições", path: "/admin/competicoes", icon: <Trophy size={20} /> }, //
  { name: "Treinadores", path: "/admin/treinadores", icon: <ShieldCheck size={20} /> },
  { name: "Fisioterapia", path: "/admin/fisioterapia", icon: <HeartPulse size={20} /> },
  { name: "Analistas", path: "/admin/analistas", icon: <BarChart3 size={20} /> },
  { name: "Coordenadores", path: "/admin/coordenadores", icon: <Briefcase size={20} /> },
  { name: "Notificações", path: "/admin/notificacoes", icon: <Bell size={20} /> },
  { name: "Documentos", path: "/admin/documentos", icon: <FileText size={20} /> },
  { name: "Configurações", path: "/admin/configuracoes", icon: <Settings size={20} /> },
];



export default function AdminLayout() {
  const { user, perfilAtivo, setPerfilAtivo, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation(); // Usando useLocation para obter a rota atual

  const navigateToProfile = (perfil: string) => {
    console.log("🧭 Perfil selecionado:", perfil);
  
    const modalidade = user?.modalidade?.trim();
    const posicao = user?.posicao;
  
    // Atleta
    if (perfil.startsWith("Atleta")) {
      if (modalidade === "Basquetebol") return navigate("/atleta/basquetebol");
      if (modalidade === "Hóquei em Patins") {
        return posicao === "Guarda-Redes"
          ? navigate("/atleta/hoquei/guarda-redes")
          : navigate("/atleta/hoquei/jogador");
      }
      // fallback
      return navigate("/"); // ou mostra um alerta
    }
  
    // Treinador
    if (perfil.startsWith("Treinador")) {
      if (modalidade === "Basquetebol") return navigate("/treinador/basquetebol");
      if (modalidade === "Hóquei em Patins") return navigate("/treinador/hoquei-em-patins");
  
      return navigate("/"); // fallback
    }
  
    const perfilRotas: Record<string, string> = {
      "Administrador": "/admin/dashboard",
      "Analista": "/analistas",
      "Fisioterapeuta": "/fisioterapia",
      "Preparador Físico": "/preparador-fisico",
      "Coordenador Hóquei": "/coordenadores",
    };
  
    const rota = perfilRotas[perfil];
    console.log("🔁 Navegar para:", rota);
    return navigate(rota ?? "/");
  };
  
  
  
  
  
  const handlePerfilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfile = e.target.value;
    setPerfilAtivo(selectedProfile);
    localStorage.setItem("perfilAtivo", selectedProfile);
  
    // Pequeno atraso para garantir que o estado é aplicado antes do redirect
    setTimeout(() => {
      navigateToProfile(selectedProfile);
    }, 0);
  };
  
  

  // Função para determinar o título com base na rota
  const getTitle = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return "Painel de Controlo"; // Título para a página do painel
      case "/admin/usuarios":
        return "Gestão de Usuários"; // Título para a página de usuários
      case "/admin/modalidades":
        return "Gestão de Modalidades"; // Título para a página de modalidades
      case "/admin/escaloes":
        return "Gestão de Escalões"; // Título para a página de Escalões
      case "/admin/treinadores":
        return "Gestão de Treinadores"; // Título para a página de Treinadores
      case "/admin/coordenadores":
        return "Gestão de Coordenadores"; // Título para a página de Coordenadores
      case "/admin/fisioterapia":
          return "Gestão de Fisioterapeutas"; // Título para a página de Fisioterapia
      case "/admin/analistas":
        return "Gestão de Analistas"; // Título para a página de Analistas
        case "/admin/competicoes":
      return "Gestão de Competições"; // Título para a página de Competição
      default:
        return "Painel de Controlo"; // Título padrão
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white shadow-md p-6">
  <div className="mb-8 text-center">
    <img src="/logo_clube.png" alt="Logo" className="h-10 mx-auto" />
  </div>
  <nav className="space-y-2">
    {menuItems.map((item) => (
      <NavLink
        to={item.path}
        key={item.name}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
            isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`
        }
      >
        {item.icon}
        {item.name}
      </NavLink>
    ))}
  </nav>
</aside>


      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Cabeçalho dinâmico */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1> {/* Exibe o título dinâmico */}
          <div className="relative flex items-center gap-4">
  <div className="text-right">
    <p className="text-sm font-medium text-gray-700">{user?.nome || "Utilizador"}</p>
    <select
      value={perfilAtivo ?? ""}
      onChange={handlePerfilChange}
      className="text-xs text-gray-500 bg-transparent border-none outline-none cursor-pointer mt-1"
    >
      {user?.perfil.map((perfil, idx) => (
        <option key={idx} value={perfil}>
          {perfil}
        </option>
      ))}
    </select>
  </div>

  <img
    src={user?.foto || "/avatar.png"}
    alt="Avatar"
    className="w-10 h-10 rounded-full object-cover border"
  />

  <button
    onClick={logout}
    className="text-red-500 hover:text-red-700 text-xl"
    title="Terminar Sessão"
  >
    ⎋
  </button>
</div>

        </div>
        <Outlet />
      </main>
    </div>
  );
}
