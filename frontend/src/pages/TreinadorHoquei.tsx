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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TreinadorHoquei = () => {
  const { user, logout, perfilAtivo, setPerfilAtivo, loading } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarGuardaRedes, setMostrarGuardaRedes] = useState(false);
  const [escalaoSelecionado, setEscalaoSelecionado] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log("Perfis do utilizador:", user?.perfil);

  // useEffect para verificar e redirecionar para a página de login se necessário
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
  
  if (loading) return null; // ou <LoadingSpinner />
  

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

  const handlePerfilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfile = e.target.value;

    console.log("Perfil selecionado:", selectedProfile);
    
    setPerfilAtivo(selectedProfile); // Atualiza o estado do perfil ativo
    localStorage.setItem("perfilAtivo", selectedProfile); // Armazena no localStorage
    navigateToProfile(selectedProfile); // Navega para a página correspondente
  };

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
  
  
  
  
  

  // Se não houver usuário, retorna null (não renderiza a página)
  if (!user) return null;

  const todosUtilizadores = JSON.parse(localStorage.getItem('utilizadores') || '[]');
  const estatisticasAtletas = todosUtilizadores
    .filter((u: any) =>
      u.perfil === 'Atleta' &&
      u.modalidade === 'Hóquei em Patins' &&
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
  const estatisticasGuardaRedes = [];

  const data = {
    labels: ['Golos Marcados', 'Golos Sofridos', 'Diferença de Golos'],
    datasets: [
      {
        label: 'Estatísticas',
        data: [45, 30, 15],
        backgroundColor: ['#4ade80', '#f87171', '#60a5fa'],
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
            <div className="flex flex-col items-center text-center">
              <span className="text-sm text-gray-700 font-medium">{user?.nome}</span>
              {/* Seletor de perfil abaixo do nome */}
              <select
                value={perfilAtivo ?? ""}
                onChange={handlePerfilChange}
                className="text-xs text-gray-500 bg-transparent border-none outline-none cursor-pointer mt-1"
              >
                {user?.perfil && user.perfil.map((perfil, idx) => (
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
                navigate("/"); // Navega de volta para a página de login
              }}
              className="text-red-500 hover:text-red-700 text-xl"
              title="Terminar Sessão"
            >
              ⎋
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
            <h2 className="text-lg font-semibold mb-3">Desempenho de Golos</h2>
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
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-400 flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-gray-600">3</span>
                  </div>
                  <p className="text-gray-700 font-medium">Empates</p>
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
                <h2 className="text-xl font-semibold">
                  Estatísticas de {mostrarGuardaRedes ? 'Guarda-Redes' : 'Jogadores de Campo'}
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMostrarGuardaRedes((prev) => !prev)}
                    className="text-blue-600 hover:text-blue-800 text-2xl"
                    title="Alternar entre Guarda-Redes e Jogadores"
                  >
                    <MdSwapHoriz />
                  </button>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    ✖
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mostrarGuardaRedes ? 'gr' : 'campo'}
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
                        {mostrarGuardaRedes ? (
                          <>
                            <th className="py-2 px-2">Golos Sofridos</th>
                            <th className="py-2 px-2">Defesas</th>
                            <th className="py-2 px-2">Minutos</th>
                            <th className="py-2 px-2">Azuis</th>
                            <th className="py-2 px-2">Vermelhos</th>
                            <th className="py-2 px-2">Penaltis (Def/Total)</th>
                            <th className="py-2 px-2">LD (Def/Total)</th>
                          </>
                        ) : (
                          <>
                            <th className="py-2 px-2">Golos</th>
                            <th className="py-2 px-2">Assistências</th>
                            <th className="py-2 px-2">Minutos</th>
                            <th className="py-2 px-2">Faltas</th>
                            <th className="py-2 px-2">Azuis</th>
                            <th className="py-2 px-2">Vermelhos</th>
                            <th className="py-2 px-2">Penaltis (Marc/Total)</th>
                            <th className="py-2 px-2">LD (Marc/Total)</th>
                            <th className="py-2 px-2">B. Perdidas</th>
                            <th className="py-2 px-2">B. Recuperadas</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: mostrarGuardaRedes ? 4 : 15 }).map((_, i) => {
                        const j = (mostrarGuardaRedes ? estatisticasGuardaRedes : estatisticasAtletas)[i] || {};

                        return (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-2 font-medium">{j.nome || '–'}</td>
                            <td className="py-2 px-2">{j.jogos ?? '–'}</td>
                            <td className="py-2 px-2">{j.cincoInicial ?? '–'}</td>

                            {mostrarGuardaRedes ? (
                              <>
                                <td className="py-2 px-2">{j.golosSofridos ?? '–'}</td>
                                <td className="py-2 px-2">{j.defesas ?? '–'}</td>
                                <td className="py-2 px-2">{j.minutos ?? '–'}</td>
                                <td className="py-2 px-2">{j.cartoesAzuis ?? '–'}</td>
                                <td className="py-2 px-2">{j.cartoesVermelhos ?? '–'}</td>
                                <td className="py-2 px-2">{j.penaltis ?? '–'}</td>
                                <td className="py-2 px-2">{j.livresDiretos ?? '–'}</td>
                              </>
                            ) : (
                              <>
                                <td className="py-2 px-2">{j.golos ?? '–'}</td>
                                <td className="py-2 px-2">{j.assistencias ?? '–'}</td>
                                <td className="py-2 px-2">{j.minutos ?? '–'}</td>
                                <td className="py-2 px-2">{j.faltas ?? '–'}</td>
                                <td className="py-2 px-2">{j.cartoesAzuis ?? '–'}</td>
                                <td className="py-2 px-2">{j.cartoesVermelhos ?? '–'}</td>
                                <td className="py-2 px-2">{j.penaltis ?? '–'}</td>
                                <td className="py-2 px-2">{j.livresDiretos ?? '–'}</td>
                                <td className="py-2 px-2">{j.bolasPerdidas ?? '–'}</td>
                                <td className="py-2 px-2">{j.bolasRecuperadas ?? '–'}</td>
                              </>
                            )}
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

export default TreinadorHoquei;
