import React, { useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AtletaHoqueiGR = () => {
  const {
    user,
    logout,
    perfilAtivo,
    setPerfilAtivo,
    loading,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user) return null;

  const navigateToProfile = (perfil: string) => {
    // 🧭 Lógica especial para atletas
    if (perfil === "Atleta Hóquei em Patins") {
      if (user?.posicao === "Guarda-Redes") {
        return navigate("/atleta/hoquei/guarda-redes");
      } else {
        return navigate("/atleta/hoquei/jogador");
      }
    }
  
    if (perfil === "Atleta Basquetebol") {
      return navigate("/atleta/basquetebol");
    }
  
    // Mapear restantes perfis
    const perfilRotas: Record<string, string> = {
      "Administrador": "/admin",
      "Treinador Hóquei em Patins": "/treinador/hoquei-em-patins",
      "Treinador Basquetebol": "/treinador/basquetebol",
      "Atleta Hóquei em Patins": "/atleta/hoquei/jogador",
      "Atleta Hóquei - Guarda-Redes": "/atleta/hoquei/guarda-redes",
      "Atleta Basquetebol": "/atleta/basquetebol",
      "Analista": "/analistas",
      "Fisioterapeuta": "/fisioterapia",
      "Preparador Físico": "/preparador-fisico",
      "Coordenador Hóquei": "/coordenadores/hoquei",
      "Coordenador Basquetebol": "/coordenadores/basquetebol"
    };
    
  
    const rota = perfilRotas[perfil];
    console.log("🔁 Navegar para:", rota);
    navigate(rota ?? "/");
  };
  

  const handlePerfilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfile = e.target.value;
    setPerfilAtivo(selectedProfile);
    localStorage.setItem("perfilAtivo", selectedProfile);
    navigateToProfile(selectedProfile);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-screen-xl px-4 space-y-8">

        {/* Faixa superior */}
        <div className="bg-white shadow flex items-center justify-between px-6 py-4">
          <div className="flex justify-start flex-grow">
            <img src="/logo_clube.png" alt="Logo do Clube" className="h-10" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user.nome}</p>
              <select
                value={perfilAtivo ?? ""}
                onChange={handlePerfilChange}
                className="text-xs text-gray-500 bg-transparent border-none outline-none cursor-pointer mt-1"
              >
                {user.perfil.map((perfil, idx) => (
                  <option key={idx} value={perfil}>
                    {perfil}
                  </option>
                ))}
              </select>
            </div>

            <img
              src={user.foto ?? "/avatar.png"}
              alt="Foto do utilizador"
              className="w-10 h-10 rounded-full object-cover border"
            />

            <button onClick={handleLogout} className="text-gray-700">
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="space-y-8">
          {/* Header de boas-vindas */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span>🏒</span> Bem-vindo, {user?.nome}!
            </h1>
            <p className="text-base text-gray-500">{user?.modalidade}</p>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Menor gap */}
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Jogos Disputados 🏒</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">32</h2>
              <p className="text-xs text-green-600 mt-1">+4 em relação à última temporada</p>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Golos Sofridos ⚫</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">5</h2>
              <p className="text-xs text-green-600 mt-1">recorde pessoal esta temporada</p>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Defesas 🛑</p> {/* Alterado para Defesas */}
              <h2 className="text-2xl font-bold text-gray-800 mt-1">120</h2>
              <p className="text-xs text-green-600 mt-1">+10 em relação à última temporada</p>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">% Taxa de Vitória 📈</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">70%</h2>
              <p className="text-xs text-green-600 mt-1">+6% em relação à última temporada</p>
            </div>
          </div>

          {/* Gráficos / Seções futuras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[250px]">
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-md font-semibold text-gray-700 mb-2">Defesas e Golos Sofridos por Mês</h2>
              <p className="text-sm text-gray-400">Em breve gráfico aqui.</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-md font-semibold text-gray-700 mb-2">Percentagem de Defesas por Mês</h2>
              <p className="text-sm text-gray-400">Gráfico será adicionado.</p>
            </div>
          </div>

          {/* Informações da equipa */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-md font-semibold text-gray-700 mb-4">Informações da Equipa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 text-sm text-gray-700 gap-4">
              <div>
                <p className="font-bold">FC Barcelona Hóquei</p>
                <p className="text-gray-500">Liga Espanhola de Hóquei em Patins</p>
              </div>
              <div>
                <p className="text-gray-500">Estado da Temporada</p>
                <p className="font-bold">Temporada Regular</p>
                <p className="text-xs text-gray-400">Semana 20 de 28</p>
              </div>
              <div>
                <p className="text-gray-500">Classificação da Equipa</p>
                <p className="font-bold">#2 na Liga Espanhola</p>
                <p className="text-xs text-gray-400">22V - 5D</p>
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  <button className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:bg-gray-50 transition duration-200">
    <span className="text-2xl">📅</span>
    <span className="text-sm font-semibold text-gray-700 mt-1">Agenda</span>
  </button>

  <button className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:bg-gray-50 transition duration-200">
    <span className="text-2xl">🚑</span>
    <span className="text-sm font-semibold text-gray-700 mt-1">Histórico de Lesões</span>
  </button>

  <button className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:bg-gray-50 transition duration-200">
    <span className="text-2xl">📊</span>
    <span className="text-sm font-semibold text-gray-700 mt-1">Estatísticas</span>
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default AtletaHoqueiGR;
