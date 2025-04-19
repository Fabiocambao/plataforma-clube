// TreinadorHoquei.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { MdSwapHoriz } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from "react-icons/fa";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TreinadorBasquetebol = () => {
  const { user, perfilAtivo, setPerfilAtivo, logout, loading } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [escalaoSelecionado, setEscalaoSelecionado] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePerfilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedProfile = e.target.value;
      setPerfilAtivo(selectedProfile);
      localStorage.setItem("perfilAtivo", selectedProfile);
    
      // 🕒 Garante que o estado atualiza antes de navegar
      setTimeout(() => {
        navigateToProfile(selectedProfile);
      }, 0);
    };

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
    

  const navigateToProfile = (perfil: string) => {
    const rota = perfilRotas[perfil];
    if (rota) navigate(rota);
    else navigate("/");
  };

  const eventosAgenda = useMemo(() => {
    const data = localStorage.getItem('events');
    if (!data) return [];
  
    return JSON.parse(data)
      .map((e: any) => ({
        ...e,
        start: new Date(e.start),
      }))
      .filter((e: any) => e.tipoEvento === 'Jogo' && e.start > new Date())
      .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());
  }, []);
  const proximoJogo = useMemo(() => {
    return eventosAgenda.find((e: any) =>
      e.escalao?.toLowerCase().trim() === escalaoSelecionado?.toLowerCase().trim()
    );
  }, [eventosAgenda, escalaoSelecionado]);
  
  
  

  useEffect(() => {
    if (loading) return;
  
    if (!user || !user.perfil.some((p) => p.toLowerCase().includes('treinador'))) {
      navigate('/');
    }
  
    if (user?.escaloes && user.escaloes.length > 0) {
      setEscalaoSelecionado(user.escaloes[0]);
    }
  }, [user, loading, navigate]);
  

  if (loading || !user) return null;


  const todosUtilizadores = JSON.parse(localStorage.getItem('utilizadores') || '[]');

  const estatisticasAtletas = todosUtilizadores
    .filter((u: any) =>
      u.perfil === 'Atleta' &&
      u.modalidade === 'Basquetebol' &&
      (!escalaoSelecionado || u.escalao?.trim().toLowerCase() === escalaoSelecionado.trim().toLowerCase()) &&
      u.estatisticas
    )
    .map((u: any) => ({
      nome: u.nome,
      escalao: u.escalao,
      jogos: u.estatisticas.jogos || 0,
      cincoInicial: u.estatisticas.cincoInicial || 0,
      golos: u.estatisticas.golos || 0,
      assistencias: u.estatisticas.assistencias || 0,
      minutos: u.estatisticas.minutos || 0,
      cartoesAzuis: u.estatisticas.cartoesAzuis || 0,
      cartoesVermelhos: u.estatisticas.cartoesVermelhos || 0,
      penaltis: u.estatisticas.penaltis || '0/0',
      livresDiretos: u.estatisticas.livresDiretos || '0/0',
      bolasPerdidas: u.estatisticas.bolasPerdidas || 0,
      bolasRecuperadas: u.estatisticas.bolasRecuperadas || 0,
      foto: u.foto || '/avatar.png',
    }));


  const atletasFiltrados = estatisticasAtletas;

  // 🧮 Cálculo das percentagens
const calcularPercentagem = (str: string) => {
    const [marcados, tentados] = str?.split("/")?.map(Number) || [0, 0];
    if (!tentados) return 0;
    return Math.round((marcados / tentados) * 100);
  };
  
  const totais = estatisticasAtletas.reduce(
    (tot, a) => {
      const [m2, t2] = a.lances2pt?.split("/").map(Number) || [0, 0];
      const [m3, t3] = a.lances3pt?.split("/").map(Number) || [0, 0];
      const [ml, tl] = a.lancesLivres?.split("/").map(Number) || [0, 0];
  
      tot.marcados2pt += m2;
      tot.tentados2pt += t2;
      tot.marcados3pt += m3;
      tot.tentados3pt += t3;
      tot.marcadosLL += ml;
      tot.tentadosLL += tl;
  
      return tot;
    },
    { marcados2pt: 0, tentados2pt: 0, marcados3pt: 0, tentados3pt: 0, marcadosLL: 0, tentadosLL: 0 }
  );
  
  const percent2pt = calcularPercentagem(`${totais.marcados2pt}/${totais.tentados2pt}`);
  const percent3pt = calcularPercentagem(`${totais.marcados3pt}/${totais.tentados3pt}`);
  const percentLL = calcularPercentagem(`${totais.marcadosLL}/${totais.tentadosLL}`);
  
  // 📊 Dados do gráfico
  const data = {
    labels: ['% 2PT', '% 3PT', '% L. Livres'],
    datasets: [
      {
        label: 'Eficiência de Lançamento',
        data: [percent2pt, percent3pt, percentLL],
        backgroundColor: ['#60a5fa', '#facc15', '#34d399'],
      },
    ],
  };
  


  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const ultimosJogos = [
    { data: '02/04/2025', competicao: 'Campeonato Nacional', local: 'Casa', adversario: 'FC Porto', resultado: '3-1' },
    { data: '28/03/2025', competicao: 'Taça de Portugal', local: 'Fora', adversario: 'Sporting CP', resultado: '2-2' },
  ];

  const getResultadoClass = (res: string) => {
    const [g1, g2] = res.split('-').map(Number);
    if (g1 > g2) return 'text-green-600';
    if (g1 < g2) return 'text-red-600';
    return 'text-gray-600';
  };

  const jogos = 24;
  const vitorias = 18;
  const taxaVitoria = Math.round((vitorias / jogos) * 100);

  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <img src="/logo_clube.png" alt="Logo" className="h-10" />
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-700 font-medium">{user.nome}</span>
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
              alt="Foto"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-gray-700 hover:text-gray-700 text-xl"
              title="Terminar Sessão"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* Cards dos Jogadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {atletasFiltrados.length > 0 ? (
            [
              { estat: 'Golos', key: 'golos' },
              { estat: 'Assistências', key: 'assistencias' },
              { estat: 'Minutos Jogados', key: 'minutos' },
              { estat: 'Cinco Inicial', key: 'cincoInicial' },
            ].map((item, idx) => {
              const melhor = atletasFiltrados.reduce((max, atual) =>
                atual[item.key] > max[item.key] ? atual : max, atletasFiltrados[0]);

              return (
                <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                  <h3 className="text-sm text-gray-500">{item.estat}</h3>
                  <div className="text-3xl font-bold text-gray-800 mt-1">{melhor[item.key]}</div>
                  <img
                    src={melhor.foto ?? "/avatar.png"}
                    alt={melhor.nome}
                    className="w-16 h-16 rounded-full object-cover mt-3"
                  />
                  <h4 className="mt-2 text-sm text-gray-700">{melhor.nome}</h4>
                </div>
              );
            })
          ) : (
            <div className="col-span-4 text-center text-gray-500 p-6 bg-white rounded-xl shadow">
              Nenhum jogador disponível para o escalão selecionado.
            </div>
          )}
        </div>

        {/* Gráfico + Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico */}
          <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Eficiência de Lançamentos</h2>
            <Bar data={data} options={options} />
          </div>

          {/* Resumo da Equipa */}
          <div className="bg-white rounded shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="ri-team-line ri-lg mr-2 text-primary"></i>
              Resumo da Equipa
            </h2>

            <div className="flex flex-col space-y-6">
              {/* Estatísticas em círculos */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border-4 border-primary flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-primary">24</span>
                  </div>
                  <p className="text-gray-700 font-medium">Jogos</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-500 flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-green-600">18</span>
                  </div>
                  <p className="text-gray-700 font-medium">Vitórias</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-red-200 border-4 border-red-500 flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-red-600">3</span>
                  </div>
                  <p className="text-gray-700 font-medium">Derrotas</p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Taxa de Vitória</span>
                  <span className="text-sm font-medium text-gray-700">{taxaVitoria}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${taxaVitoria}%` }}
                  ></div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded flex items-center">
                  <i className="ri-trophy-line ri-lg text-yellow-500 mr-2"></i>
                  <div>
                    <p className="text-xs text-gray-500">Posição na Liga</p>
                    <p className="font-bold text-gray-800">2º Lugar</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded flex items-center">
                  <i className="ri-calendar-check-line ri-lg text-blue-500 mr-2"></i>
                  <div>
                  <p className="text-xs text-gray-500">Próximo Jogo</p>
<p className="font-bold text-gray-800">
  {proximoJogo
    ? new Date(proximoJogo.start).toLocaleDateString('pt-PT')
    : 'Sem jogo marcado'}
</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
<div className="flex gap-4 justify-center">
<button
  onClick={() => navigate("/agenda")}
  className="bg-white border px-4 py-2 rounded flex items-center gap-2"
>
  📅 Agenda
</button>


  <button
    onClick={() => setMostrarModal(true)}
    className="bg-white border px-4 py-2 rounded flex items-center gap-2"
  >
    📊 Estatísticas de Todos os Atletas
  </button>
  <button className="bg-white border px-4 py-2 rounded flex items-center gap-2">
    📈 Análise
  </button>
</div>


        {/* Modal de Estatísticas */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl w-full overflow-auto relative max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Estatísticas dos Atletas</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >✖</button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                key="basquetebol"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="origin-center"
  >
    <table className="w-full text-sm text-left border">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-2">Nome</th>
          <th className="py-2 px-2">Jogos</th>
          <th className="py-2 px-2">5 Inicial</th>
          <th className="py-2 px-2">Pontos</th>
          <th className="py-2 px-2">Assistências</th>
          <th className="py-2 px-2">Ressaltos</th>
          <th className="py-2 px-2">2PT</th>
          <th className="py-2 px-2">3PT</th>
          <th className="py-2 px-2">L. Livres</th>
          <th className="py-2 px-2">Faltas</th>
          <th className="py-2 px-2">Minutos</th>
        </tr>
      </thead>
      <tbody>
  {[...Array(15)].map((_, i) => {
    const atleta = estatisticasAtletas[i];

    return (
      <tr key={i} className="border-t hover:bg-gray-50">
        <td className="py-2 px-2 font-medium">{atleta?.nome || '-'}</td>
        <td className="py-2 px-2">{atleta?.jogos ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.cincoInicial ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.pontos ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.assistencias ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.ressaltos ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.lances2pt ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.lances3pt ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.lancesLivres ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.faltas ?? '-'}</td>
        <td className="py-2 px-2">{atleta?.minutos ?? '-'}</td>
      </tr>
    );
  })}
</tbody>

    </table>
  </motion.div>
</AnimatePresence>


            </div>
          </div>
        )}

        {/* Tabela de Últimos Jogos */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Últimos Jogos</h2>
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Data</th>
                <th className="py-2">Competição</th>
                <th className="py-2">Local</th>
                <th className="py-2">Adversário</th>
                <th className="py-2">Resultado</th>
                <th className="py-2">Estatística</th>
              </tr>
            </thead>
            <tbody>
              {ultimosJogos.map((j, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{j.data}</td>
                  <td className="py-2">{j.competicao}</td>
                  <td className="py-2">{j.local}</td>
                  <td className="py-2">{j.adversario}</td>
                  <td className={`py-2 font-semibold ${getResultadoClass(j.resultado)}`}>{j.resultado}</td>
                  <td className="py-2 text-red-500 hover:underline cursor-pointer">Ver Detalhes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TreinadorBasquetebol;
