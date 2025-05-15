import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../index.css";



function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
  
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  
    const user = usuarios.find((u: any) => {
      return (
        u.id.trim().toLowerCase() === userId.trim().toLowerCase() &&
        u.password === password
      );
    });
  
    if (!user) {
      setErro("Credenciais inválidas");
      return;
    }
  
    // Trata os escalões
    const rawEscaloes = user.escaloes ?? user.escalao ?? user["escalão"];
    const escaloesConvertidos = Array.isArray(rawEscaloes)
      ? rawEscaloes.map((e: string) => e.trim())
      : typeof rawEscaloes === "string"
      ? rawEscaloes.split(",").map((e: string) => e.trim())
      : [];
  
      const userCorrigido = { ...user, escaloes: escaloesConvertidos };

      // ✅ Salvar perfilAtivo antes de fazer login
      console.log("PERFIL ORIGINAL:", user.perfil);

      const perfil = Array.isArray(user.perfil) ? user.perfil[0] : user.perfil;
      localStorage.setItem("perfilAtivo", perfil);
      
      console.log("🔍 Utilizador encontrado no login:", userCorrigido);
      
      // ✅ Login no contexto
      login(userCorrigido);
      
  
    setTimeout(() => {
      const userGuardado = JSON.parse(localStorage.getItem("user") || "{}");
      const perfilAtivo = localStorage.getItem("perfilAtivo");
  
      console.log("📁 user guardado no localStorage:", userGuardado);
      console.log("📌 perfilAtivo guardado:", perfilAtivo);
  
      if (!perfilAtivo) {
        setErro("Perfil ativo não definido. Verifica a configuração.");
        return;
      }
  
      const posicao = userGuardado.posicao;
      const modalidade = (userGuardado.modalidade || "").trim();
  
      switch (perfilAtivo) {
        case "Administrador":
          return navigate("/admin/dashboard");
        case "Analista":
          return navigate("/analistas");
        case "Fisioterapeuta":
          return navigate("/fisioterapeuta");
        case "Preparador Físico":
          return navigate("/preparador-fisico");
        case "Coordenador Hóquei":
          return navigate("/coordenador/hoquei");
          
        case "Treinador Basquetebol":
          return navigate("/treinador/basquetebol");
        case "Treinador Hóquei em Patins":
          return navigate("/treinador/hoquei-em-patins");
        case "Atleta Basquetebol":
          return navigate("/atleta/basquetebol");
        case "Atleta Hóquei em Patins":
          return posicao === "Guarda-Redes"
            ? navigate("/atleta/hoquei/guarda-redes")
            : navigate("/atleta/hoquei/jogador");
        default:
          setErro("Perfil desconhecido. Verifica as permissões.");
      }
    }, 100); // Dá tempo ao contexto para atualizar
  };
  
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <img src="/logo_clube.png" alt="Logo do Clube" className="w-24 mb-2" />
      <p className="text-sm text-gray-600 mb-6">Apenas Pessoal Autorizado</p>

      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow-md"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-1">
          Login do Membro
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Acesso limitado aos membros da organização
        </p>

        {erro && (
          <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>
        )}

        <label className="text-sm font-medium text-gray-700 block mb-1">
          ID do Membro
        </label>
        <input
          type="text"
          placeholder="Digite o seu ID"
          className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <label className="text-sm font-medium text-gray-700 block mb-1">
          Senha
        </label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Digite a sua senha"
            className="w-full px-4 py-2 border rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-blue-600" />
            Lembrar meu ID de membro
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800 font-semibold transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
