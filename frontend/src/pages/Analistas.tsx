import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EstatisticasHoquei from "./EstatisticasHoquei";
import { Edit, Trash2 } from "lucide-react";

const Analistas = () => {
  const { user, perfilAtivo, setPerfilAtivo, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [dadosBase, setDadosBase] = useState({
    adversario: '', data: '', local: '', modalidade: '', escaloes: [] as string[], competicao: ''
  });
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // ✅ Redireciona se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  // ✅ Lógica de redirecionamento de perfis
  const navigateToProfile = (perfil: string) => {
    if (perfil === "Atleta Hóquei em Patins") {
      if (user.posicao === "Guarda-Redes") return navigate("/atleta/hoquei/guarda-redes");
      return navigate("/atleta/hoquei/jogador");
    }

    if (perfil === "Atleta Basquetebol") return navigate("/atleta/basquetebol");
    if (perfil === "Treinador Basquetebol") return navigate("/treinador/basquetebol");
    if (perfil === "Treinador Hóquei em Patins") return navigate("/treinador/hoquei-em-patins");
    if (perfil === "Administrador") return navigate("/admin/dashboard");
    if (perfil === "Analista") return navigate("/analistas");
    if (perfil === "Fisioterapeuta") return navigate("/fisioterapia");
    if (perfil === "Preparador Físico") return navigate("/preparador-fisico");
    if (perfil === "Coordenador Hóquei") return navigate("/coordenadores");
    navigate("/");
  };

  const handlePerfilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setPerfilAtivo(selected);
    localStorage.setItem("perfilAtivo", selected);
    navigateToProfile(selected);
  };
  

  const todosUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const jogadoresDoEscalao = todosUsuarios.filter((u) => {
    const escaloesDoAtleta = Array.isArray(u.escalão)
      ? u.escalão
      : typeof u.escalão === "string"
      ? [u.escalão]
      : [];
  
    return (
      u.perfil === "Atleta" &&
      u.modalidade === dadosBase.modalidade &&
      escaloesDoAtleta.some((e: string) => dadosBase.escaloes.includes(e))
    );
  });
  

  const [ultimaInsercao, setUltimaInsercao] = useState<any[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalidades, setModalidades] = useState<any[]>([]);
  const [escaloes, setEscaloes] = useState<string[]>([]);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [competicoes, setCompeticoes] = useState<any[]>([]);
  const [competicoesFiltradas, setCompeticoesFiltradas] = useState<any[]>([]);

  const handleEliminar = (index: number) => {
    const confirm = window.confirm("Tens a certeza que queres eliminar esta estatística?");
    if (!confirm) return;
  
    const atualizadas = [...ultimaInsercao];
    atualizadas.splice(index, 1);
    setUltimaInsercao(atualizadas);
    localStorage.setItem("estatisticas_jogos", JSON.stringify(atualizadas));
  };
  
  const handleEditar = (index: number) => {
    const item = ultimaInsercao[index];
  
    setDadosBase({
      adversario: item.adversario,
      data: item.data,
      local: item.local,
      modalidade: item.modalidade,
      escaloes: item.escaloes,
      competicao: item.competicao ?? "",
    });
  
    setEstatisticas({
      jogadoresCampo: item.jogadores?.jogadoresCampo || [],
      guardaRedes: item.jogadores?.guardaRedes || [],
    });
  
    setEditIndex(index);
    setModalAberto(true);
  };
  
  


  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem('estatisticas_jogos') || '[]');
    setUltimaInsercao(guardadas);
    const mods = JSON.parse(localStorage.getItem('modalidades') || '[]');
    setModalidades(mods);
    const comps = JSON.parse(localStorage.getItem('competicoes') || '[]');
    setCompeticoes(comps);
  }, []);

  useEffect(() => {
    const equipas = JSON.parse(localStorage.getItem("equipas") || "[]");
    const equipaSelecionada = equipas.find((e: any) => e.nome === dadosBase.modalidade);
    if (equipaSelecionada) {
      const nomes = equipaSelecionada.escalões?.map((esc: any) => esc.nome) || [];
      setEscaloes(nomes);
    } else {
      setEscaloes([]);
    }
  }, [dadosBase.modalidade]);

  useEffect(() => {
    if (!dadosBase.modalidade || dadosBase.escaloes.length === 0) return;
  
    const filtradas = competicoes.filter((comp: any) => {
      const compModalidade = comp.modalidade?.trim().toLowerCase();
      const compEscalao = comp.escalao?.trim().toLowerCase();
  
      return (
        compModalidade === dadosBase.modalidade.trim().toLowerCase() &&
        dadosBase.escaloes.some((esc) => esc.trim().toLowerCase() === compEscalao)
      );
    });
  
    setCompeticoesFiltradas(filtradas);
  }, [dadosBase.modalidade, dadosBase.escaloes, competicoes]);
  
  
  
  

  const handleChange = (campo: string, valor: any) => {
    setDadosBase(prev => ({ ...prev, [campo]: valor }));
  };  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <img src="/logo_clube.png" alt="Logo" className="h-10" />
          <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center text-center">
  <span className="text-sm text-gray-700 font-medium">{user?.nome}</span>
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

            <img src={user?.foto ?? "/avatar.png"} alt="Foto" className="w-10 h-10 rounded-full object-cover border" />
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-red-500 hover:text-red-700 text-xl"
              title="Terminar Sessão"
            >
              ⎋
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Estatísticas</h1>
          <button
            onClick={() => setModalAberto(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Nova Estatística
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow">
          {ultimaInsercao.length === 0 ? (
            <p className="text-gray-500">Ainda não existem estatísticas guardadas.</p>
          ) : (
            <ul className="space-y-2">
              {ultimaInsercao.map((e, idx) => (
  <li key={idx} className="p-2 border rounded flex justify-between items-center">
    <div>
      <strong>{e.modalidade} - {Array.isArray(e.escaloes) ? e.escaloes.join(", ") : e.escaloes}</strong> vs <strong>{e.adversario}</strong> em {new Date(e.data).toLocaleDateString()}
      <div className="text-xs text-gray-500">Inserido em {new Date(e.dataHora).toLocaleString()}</div>
    </div>
    <div className="flex gap-2">
    <button
  onClick={() => handleEditar(idx)}
  className="text-gray-400 hover:text-blue-800 p-1"
  title="Editar"
>
  <Edit size={18} />
</button>
<button
  onClick={() => handleEliminar(idx)}
  className="text-gray-400 hover:text-red-800 p-1"
  title="Eliminar"
>
  <Trash2 size={18} />
</button>

    </div>
  </li>
))}

            </ul>
          )}
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-6xl p-6 rounded-lg shadow space-y-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800">Nova Estatística</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
  <input
    type="text"
    placeholder="Adversário"
    value={dadosBase.adversario}
    onChange={(e) => handleChange('adversario', e.target.value)}
    className="border p-2 rounded h-full"
  />
  <input
    type="date"
    value={dadosBase.data}
    onChange={(e) => handleChange('data', e.target.value)}
    className="border p-2 rounded h-full"
  />
  <select
  value={dadosBase.local}
  onChange={(e) => handleChange('local', e.target.value)}
  className="border p-2 rounded h-full"
  required
>
  <option value="" disabled>
    Selecionar Local
  </option>
  <option value="Casa">Casa</option>
  <option value="Fora">Fora</option>
</select>

  <select
    value={dadosBase.modalidade}
    onChange={(e) => handleChange('modalidade', e.target.value)}
    className="border p-2 rounded h-full"
  >
    <option value="">Selecionar Modalidade</option>
    {modalidades.map((m: any) => (
      <option key={m.nome} value={m.nome}>{m.nome}</option>
    ))}
  </select>

  {/* Competição */}
  <select
    value={dadosBase.competicao}
    onChange={(e) => handleChange("competicao", e.target.value)}
    className="border p-2 rounded h-full"
  >
    <option value="">Selecionar Competição</option>
    {competicoesFiltradas.map((comp: any) => (
      <option key={comp.id} value={comp.nome}>
        {comp.nome}
      </option>
    ))}
  </select>

  {/* Escalões dropdown (sem o label) */}
  <div className="relative">
    <button
      type="button"
      onClick={() => setDropdownAberto((prev) => !prev)}
      className="w-full border p-2 rounded flex justify-between items-center h-full"
    >
      {dadosBase.escaloes.length > 0
        ? dadosBase.escaloes.join(", ")
        : "Selecionar Escalões"}
      <span className="ml-2">▾</span>
    </button>

    {dropdownAberto && (
      <div className="absolute bg-white border rounded shadow-lg mt-1 w-full z-10 max-h-60 overflow-y-auto">
        {escaloes.map((esc: string) => (
          <label key={esc} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={dadosBase.escaloes.includes(esc)}
              onChange={() => {
                const atualizados = dadosBase.escaloes.includes(esc)
                  ? dadosBase.escaloes.filter((e) => e !== esc)
                  : [...dadosBase.escaloes, esc];
                setDadosBase({ ...dadosBase, escaloes: atualizados });
              }}
            />
            {esc}
          </label>
        ))}
      </div>
    )}
  </div>
</div>
{/* Botão de Cancelar fora do grid */}
<div className="text-right pt-4">
        <button
          onClick={() => setModalAberto(false)}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancelar
        </button>
      </div>


            {dadosBase.modalidade === "Hóquei em Patins" && (
  <EstatisticasHoquei
  jogadoresDisponiveis={jogadoresDoEscalao}
  estatisticasIniciais={estatisticas} // 👈 importante!
  onCancelar={() => {
    setModalAberto(false);
    setEditIndex(null);
    setEstatisticas(null);
  }}
  onGuardar={(estatisticas: any) => {
    const novaEntrada = {
      ...dadosBase,
      jogadores: estatisticas,
      dataHora: new Date().toISOString(),
    };

    let atualizadas = [...ultimaInsercao];
    if (editIndex !== null) {
      atualizadas[editIndex] = novaEntrada;
    } else {
      atualizadas = [novaEntrada, ...atualizadas];
    }

    localStorage.setItem("estatisticas_jogos", JSON.stringify(atualizadas));
    setUltimaInsercao(atualizadas);
    setModalAberto(false);
    setEditIndex(null);
    setEstatisticas(null);
  }}
/>

)}

{dadosBase.modalidade && dadosBase.modalidade !== "Hóquei em Patins" && (
  <div className="flex justify-end gap-4 pt-4">
    <button
      onClick={() => {
        setModalAberto(false);
        setEditIndex(null);
        setEstatisticas(null);
      }}      
      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
    >
      Cancelar
    </button>
    <button
      onClick={() => {
        const novaEntrada = {
          ...dadosBase,
          jogadores: [],
          dataHora: new Date().toISOString(),
        };
        const anteriores = JSON.parse(localStorage.getItem("estatisticas_jogos") || "[]");
        const atualizadas = [novaEntrada, ...anteriores];
        localStorage.setItem("estatisticas_jogos", JSON.stringify(atualizadas));
        setUltimaInsercao(atualizadas);
        setModalAberto(false);
      }}
      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
    >
      Guardar Estatística
    </button>
  </div>
)}

          </div>
        </div>
      )}
    </div>
  );
};

export default Analistas;