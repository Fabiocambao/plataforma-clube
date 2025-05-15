import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DetalhesGolos from "../components/DetalhesGolos";
import DetalhesBolasParadas from "../components/DetalhesBolasParadas";
import { Calendar } from "lucide-react";
import BalizaHeatmap from "../components/BalizaHeatmap";


const DetalheEquipa = () => {
  const { id } = useParams();
  const [equipa, setEquipa] = useState<any>(null);
  const [abaAtiva, setAbaAtiva] = useState("team");
  const [detalheAtivo, setDetalheAtivo] = useState<"golos" | "bolas" | null>(null);
  const [estatisticasEquipa, setEstatisticasEquipa] = useState({
    totalJogos: 0,
    golosMarcados: 0,
    golosSofridos: 0,
    diferencaGolos: 0,
    mediaMarcados: "0.0",
    mediaSofridos: "0.0",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];
    const equipaEncontrada = dados[epoca]?.equipas.find((e: any) => e.id === id);
    setEquipa(equipaEncontrada);

    if (equipaEncontrada) {
      const jogosDaEpoca = dados[epoca]?.jornadas.flatMap((j: any) => j.jogos) || [];
      const jogosEquipa = jogosDaEpoca.filter(
        (jogo: any) => jogo.casa === equipaEncontrada.nome || jogo.fora === equipaEncontrada.nome
      );

      let golosMarcados = 0;
      let golosSofridos = 0;

      jogosEquipa.forEach((jogo: any) => {
        const isCasa = jogo.casa === equipaEncontrada.nome;
        golosMarcados += isCasa ? jogo.golosCasa || 0 : jogo.golosFora || 0;
        golosSofridos += isCasa ? jogo.golosFora || 0 : jogo.golosCasa || 0;
      });

      const totalJogos = jogosEquipa.length;
      const diferencaGolos = golosMarcados - golosSofridos;
      const mediaMarcados = totalJogos > 0 ? (golosMarcados / totalJogos).toFixed(1) : "0.0";
      const mediaSofridos = totalJogos > 0 ? (golosSofridos / totalJogos).toFixed(1) : "0.0";

      setEstatisticasEquipa({
        totalJogos,
        golosMarcados,
        golosSofridos,
        diferencaGolos,
        mediaMarcados,
        mediaSofridos,
      });
    }
  }, [id]); // <-- agora está correto


  const [disciplina, setDisciplina] = useState({
    faltas: 0,
    azuis: 0,
    vermelhos: 0,
    mediaFaltas: "0.0",
    mediaAzuis: "0.0",
    mediaVermelhos: "0.0",
  });

  const [bolasParadas, setBolasParadas] = useState({ ofensivas: 0, defensivas: 0 });

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];
    const jornadas = dados[epoca]?.jornadas || [];
    let faltas = 0, azuis = 0, vermelhos = 0;

    jornadas.forEach((jornada: any) => {
      jornada.jogos.forEach((jogo: any) => {
        const estat = jogo.estatisticas;
        if (!estat) return;

        if (jogo.casa === equipa?.nome) {
          faltas += estat.casa["Faltas de Equipa"] || 0;
          azuis += estat.casa["Cartão Azul"] || 0;
          vermelhos += estat.casa["Cartão Vermelho"] || 0;
        } else if (jogo.fora === equipa?.nome) {
          faltas += estat.fora["Faltas de Equipa"] || 0;
          azuis += estat.fora["Cartão Azul"] || 0;
          vermelhos += estat.fora["Cartão Vermelho"] || 0;
        }
      });
    });

    setDisciplina({
      faltas,
      azuis,
      vermelhos,
      mediaFaltas: (faltas / jornadas.length).toFixed(1),
      mediaAzuis: (azuis / jornadas.length).toFixed(1),
      mediaVermelhos: (vermelhos / jornadas.length).toFixed(1),
    });

  }, [equipa]);

  const [analiseBolasParadasDetalhada, setAnaliseBolasParadasDetalhada] = useState<any[]>([]);


  useEffect(() => {
    if (!equipa) return;

    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];
    const jornadas = dados[epoca]?.jornadas || [];

    let totalOfensivas = 0;
    let totalDefensivas = 0;
    const detalhes: any[] = [];

    jornadas.forEach((jornada: any) => {
      jornada.jogos.forEach((jogo: any) => {
        const estat = jogo.estatisticas;
        if (!estat) return;

        const isCasa = jogo.casa === equipa.nome;
        const isFora = jogo.fora === equipa.nome;
        if (!isCasa && !isFora) return;

        const estatEquipa = isCasa ? estat.casa : estat.fora;
        const estatAdversario = isCasa ? estat.fora : estat.casa;
        const adversario = isCasa ? jogo.fora : jogo.casa;

        // Para os totais visuais (ignorando recargas)
        totalOfensivas +=
          (estatEquipa["Penálti"] || 0) +
          (estatEquipa["Livre Direto"] || 0) +
          (estatEquipa["Penálti Falhado"] || 0) +
          (estatEquipa["Livre Direto Falhado"] || 0);

        totalDefensivas +=
          (estatAdversario["Penálti"] || 0) +
          (estatAdversario["Livre Direto"] || 0) +
          (estatAdversario["Penálti Falhado"] || 0) +
          (estatAdversario["Livre Direto Falhado"] || 0);

        // Alimenta corretamente o DetalhesBolasParadas
        detalhes.push({
          jornada: jornada.numero,
          adversario,
          local: isCasa ? "casa" : "fora",
          estatisticas: {
            ofensivas: {
              "Penálti Marcado": estatEquipa["Penálti"] || 0,
              "Recarga Penálti Marcado": estatEquipa["Recarga Penálti"] || 0,
              "Livre Direto Marcado": estatEquipa["Livre Direto"] || 0,
              "Recarga Livre Direto Marcado": estatEquipa["Recarga Livre Direto"] || 0,
              "Penálti Falhado": estatEquipa["Penálti Falhado"] || 0,
              "Livre Direto Falhado": estatEquipa["Livre Direto Falhado"] || 0,
            },
            defensivas: {
              "Penálti Sofrido": estatAdversario["Penálti"] || 0,
              "Recarga Penálti Sofrido": estatAdversario["Recarga Penálti"] || 0,
              "Livre Direto Sofrido": estatAdversario["Livre Direto"] || 0,
              "Recarga Livre Direto Sofrido": estatAdversario["Recarga Livre Direto"] || 0,
              "Penálti Defendido": estatAdversario["Penálti Falhado"] || 0,
              "Livre Direto Defendido": estatAdversario["Livre Direto Falhado"] || 0,
            }
          }
        });
      });
    });

    setBolasParadas({ ofensivas: totalOfensivas, defensivas: totalDefensivas });
    setAnaliseBolasParadasDetalhada(detalhes);
  }, [equipa]);





  const [analiseGolosDetalhada, setAnaliseGolosDetalhada] = useState<any[]>([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];
    const jornadas = dados[epoca]?.jornadas || [];

    const tipos = ["Ataque Organizado", "Ataque Rápido", "Power Play", "Under Play"];
    const jogosDetalhados: any[] = [];

    jornadas.forEach((jornada: any) => {
      jornada.jogos.forEach((jogo: any) => {
        const estat = jogo.estatisticas;
        if (!estat) return;

        let statsJogo = {
          jornada: jornada.numero,
          adversario: "",
          local: "", // casa ou fora
          marcados: {} as Record<string, number>,
          sofridos: {} as Record<string, number>
        };

        tipos.forEach(tipo => {
          statsJogo.marcados[tipo] = 0;
          statsJogo.sofridos[tipo] = 0;
        });

        if (jogo.casa === equipa?.nome) {
          statsJogo.adversario = jogo.fora;
          statsJogo.local = "casa";
          tipos.forEach(tipo => {
            statsJogo.marcados[tipo] = estat.casa[tipo] || 0;
            statsJogo.sofridos[tipo] = estat.fora[tipo] || 0;
          });
        } else if (jogo.fora === equipa?.nome) {
          statsJogo.adversario = jogo.casa;
          statsJogo.local = "fora";
          tipos.forEach(tipo => {
            statsJogo.marcados[tipo] = estat.fora[tipo] || 0;
            statsJogo.sofridos[tipo] = estat.casa[tipo] || 0;
          });
        }

        if (statsJogo.local) jogosDetalhados.push(statsJogo);
      });
    });

    setAnaliseGolosDetalhada(jogosDetalhados);
  }, [equipa]);

  const [jogadorSelecionado, setJogadorSelecionado] = useState<any>(null);
  const [modalJogadorAberto, setModalJogadorAberto] = useState(false);
  const [filtroPenaltis, setFiltroPenaltis] = useState<"todos" | "golo" | "falhado">("todos");
  const [filtroLivres, setFiltroLivres] = useState<"todos" | "golo" | "falhado">("todos");


  const [mapaPenaltis, setMapaPenaltis] = useState<Record<string, { total: number; golo: number; falhado: number }>>({});
  const [mapaLivres, setMapaLivres] = useState<Record<string, { total: number; golo: number; falhado: number }>>({});


  useEffect(() => {
    if (!jogadorSelecionado) return;

    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];
    const jornadas = dados[epoca]?.jornadas || [];

    const zonasPenalti: Record<string, { total: number; golo: number; falhado: number }> = {};
    const zonasLivres: Record<string, { total: number; golo: number; falhado: number }> = {};

    jornadas.forEach((jornada: any) => {
      jornada.jogos.forEach((jogo: any) => {
        const bolasParadas = jogo.bolasParadas || [];

        bolasParadas.forEach((bola: any) => {
          if (bola.jogador === jogadorSelecionado.nome && bola.zona && bola.tipo) {
            const target =
              bola.tipo === "Penálti" ? zonasPenalti :
                bola.tipo === "Livre Direto" ? zonasLivres : null;

            if (!target) return;

            if (!target[bola.zona]) {
              target[bola.zona] = { total: 0, golo: 0, falhado: 0 };
            }

            target[bola.zona].total += 1;

            if (bola.resultado === "Golo" || bola.resultado === "Golo Marcado") {
              target[bola.zona].golo += 1;
            } else if (bola.resultado === "Falhado") {
              target[bola.zona].falhado += 1;
            }
          }
        });
      });
    });

    setMapaPenaltis(zonasPenalti);
    setMapaLivres(zonasLivres);
  }, [jogadorSelecionado]);




  if (!equipa) return <div className="p-6">Carregando...</div>;

  const jogadores = equipa.plantel || [];
  const mediaIdade = jogadores.length > 0 ? (jogadores.reduce((sum, j) => sum + j.idade, 0) / jogadores.length).toFixed(1) : 0;
  const estrangeiros = jogadores.filter((j: any) => j.nacionalidade !== "Portugal").length;

  const isoFlags: Record<string, string> = {
    "Português": "pt",
    "Brasileiro": "br",
    "Argentino": "ar",
    "Angolano": "ao",
    "Espanhol": "es",
    "Francês": "fr",
    "Alemão": "de",
    "Italiano": "it"
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-800"
      >
        ← Voltar
      </button>

      <div className="flex items-center gap-4 mb-6">
        <img src={equipa.logoUrl} alt={equipa.nome} className="w-20 h-20 object-cover rounded-md" />
        <h2 className="text-3xl font-bold">{equipa.nome}</h2>
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setAbaAtiva("team")} className={`px-4 py-2 rounded ${abaAtiva === "team" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Team Info</button>
        <button onClick={() => setAbaAtiva("analise")} className={`px-4 py-2 rounded ${abaAtiva === "analise" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Análise Total</button>
      </div>

      {abaAtiva === "team" && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-gradient-to-tr from-blue-50 to-white p-6 rounded-2xl shadow-md border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4">📋 Dados do Plantel</h3>
              <div className="divide-y divide-blue-100">
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Total de Jogadores</span>
                  <span className="font-semibold text-gray-800">{jogadores.length}</span>
                </div>
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Média de Idades</span>
                  <span className="font-semibold text-gray-800">{mediaIdade}</span>
                </div>
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Jogadores Estrangeiros</span>
                  <span className="font-semibold text-gray-800">{estrangeiros}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-red-50 to-white p-6 rounded-2xl shadow-md border border-red-100">
              <h3 className="text-lg font-bold text-red-800 mb-4">🟥 Capítulo Disciplinar</h3>
              <div className="divide-y divide-red-100">
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Faltas de Equipa</span>
                  <span className="font-semibold text-gray-800">
                    {disciplina.faltas} <span className="text-gray-500">({disciplina.mediaFaltas})</span>
                  </span>
                </div>
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Cartões Azuis</span>
                  <span className="font-semibold text-gray-800">
                    {disciplina.azuis} <span className="text-gray-500">({disciplina.mediaAzuis})</span>
                  </span>
                </div>
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Cartões Vermelhos</span>
                  <span className="font-semibold text-gray-800">
                    {disciplina.vermelhos} <span className="text-gray-500">({disciplina.mediaVermelhos})</span>
                  </span>
                </div>

              </div>
            </div>


            <div className="bg-gradient-to-tr from-green-50 to-white p-6 rounded-2xl shadow-md border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-4">⚽ Golos</h3>
              <div className="divide-y divide-green-100">
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Jogos</span>
                  <span className="font-semibold text-gray-800">
                    {estatisticasEquipa.totalJogos}
                  </span>
                </div>
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Golos Marcados</span>
                  <span className="font-semibold text-gray-800">
                    {estatisticasEquipa.golosMarcados}{" "}
                    <span className="text-gray-500">({estatisticasEquipa.mediaMarcados})</span>
                  </span>
                </div>
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Golos Sofridos</span>
                  <span className="font-semibold text-gray-800">
                    {estatisticasEquipa.golosSofridos}{" "}
                    <span className="text-gray-500">({estatisticasEquipa.mediaSofridos})</span>
                  </span>
                </div>
                <div className="py-2 flex justify-between text-sm text-gray-700">
                  <span>Diferença de Golos</span>
                  <span
                    className={`font-semibold ${estatisticasEquipa.diferencaGolos > 0
                      ? "text-green-600"
                      : estatisticasEquipa.diferencaGolos < 0
                        ? "text-red-600"
                        : "text-gray-800"
                      }`}
                  >
                    {estatisticasEquipa.diferencaGolos}
                  </span>
                </div>
              </div>
            </div>

          </div>


          {/* Plantel como cards */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Plantel</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {jogadores.map((j: any) => {
                const flagCode = isoFlags[j.nacionalidade] || "un"; // usa o código ISO

                return (
                  <div
                    key={j.id}
                    onClick={() => {
                      setJogadorSelecionado(j);
                      setModalJogadorAberto(true);
                    }}
                    className="bg-white rounded-xl shadow p-4 flex flex-col items-center space-y-2 cursor-pointer hover:shadow-lg transition"
                  >

                    <img
                      src={j.foto || "/avatar.png"}
                      alt={j.nome}
                      className="w-36 h-36 object-cover mx-auto mb-2"
                    />
                    <h3 className="font-bold text-lg text-center">{j.nome}</h3>
                    <p className="text-sm text-gray-600 text-center">#{j.numero} – {j.posicao}</p>
                    <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-1">
                      <Calendar size={14} /> {j.idade} anos
                    </p>
                    <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-1">
                      <img
                        src={`https://flagcdn.com/24x18/${flagCode}.png`}
                        alt={j.nacionalidade}
                        className="w-[24px] h-[18px] rounded-sm"
                      />
                      {j.nacionalidade}
                    </p>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      )}
      {/* Análise Total */}
      {abaAtiva === "analise" && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Resumo à esquerda */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Análise de Golos (compacta) */}
            <div className="bg-white p-4 shadow rounded text-sm">
              <h4 className="text-lg font-semibold mb-3">Análise de Golos</h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="border rounded p-2">
                  <p className="text-gray-500 text-xs">Golos Marcados</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticasEquipa.golosMarcados}</p>
                  <p className="text-xs text-gray-500">
                    Média: <span className="font-medium">
                      {(estatisticasEquipa.totalJogos > 0
                        ? (estatisticasEquipa.golosMarcados / estatisticasEquipa.totalJogos).toFixed(2)
                        : "0.00")}
                    </span>
                  </p>
                </div>

                <div className="border rounded p-2">
                  <p className="text-gray-500 text-xs">Golos Sofridos</p>
                  <p className="text-2xl font-bold text-red-600">{estatisticasEquipa.golosSofridos}</p>
                  <p className="text-xs text-gray-500">
                    Média: <span className="font-medium">
                      {(estatisticasEquipa.totalJogos > 0
                        ? (estatisticasEquipa.golosSofridos / estatisticasEquipa.totalJogos).toFixed(2)
                        : "0.00")}
                    </span>
                  </p>
                </div>

              </div>
              <button
                onClick={() => setDetalheAtivo("golos")}
                className="text-blue-600 mt-3 text-sm hover:underline block text-center"
              >
                Ver Detalhes
              </button>
            </div>


            {/* Análise de Bolas Paradas (compacta) */}
            <div className="bg-white p-4 shadow rounded text-sm">
              <h4 className="text-lg font-semibold mb-3">Bolas Paradas</h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="border rounded p-2">
                  <p className="text-gray-500 text-xs">Ofensivas</p>
                  <p className="text-xl font-bold text-blue-600">{bolasParadas.ofensivas}</p>
                  <p className="text-xs text-gray-500">
                    Média: <span className="font-medium">
                      {(estatisticasEquipa.totalJogos > 0
                        ? (bolasParadas.ofensivas / estatisticasEquipa.totalJogos).toFixed(2)
                        : "0.00")}
                    </span>
                  </p>
                </div>

                <div className="border rounded p-2">
                  <p className="text-gray-500 text-xs">Defensivas</p>
                  <p className="text-xl font-bold text-purple-600">{bolasParadas.defensivas}</p>
                  <p className="text-xs text-gray-500">
                    Média: <span className="font-medium">
                      {(estatisticasEquipa.totalJogos > 0
                        ? (bolasParadas.defensivas / estatisticasEquipa.totalJogos).toFixed(2)
                        : "0.00")}
                    </span>
                  </p>
                </div>

              </div>
              <button
                onClick={() => setDetalheAtivo("bolas")}
                className="text-blue-600 mt-3 text-sm hover:underline block text-center"
              >
                Ver Detalhes
              </button>
            </div>

          </div>

          {/* Detalhes à direita */}
          <div className="w-full lg:w-2/3 bg-white p-6 shadow rounded">
            {!detalheAtivo && (
              <p className="text-gray-500 text-center mt-10">Seleciona uma análise à esquerda para ver os detalhes.</p>
            )}

            {detalheAtivo === "golos" && <DetalhesGolos jogos={analiseGolosDetalhada} />}

            {detalheAtivo === "bolas" && <DetalhesBolasParadas jogos={analiseBolasParadasDetalhada} />}



            {detalheAtivo && (
              <div className="mt-6 text-right">
                <button
                  onClick={() => setDetalheAtivo(null)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Fechar Detalhes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {modalJogadorAberto && jogadorSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">Bolas Paradas de {jogadorSelecionado.nome}</h2>

            <div className="flex flex-col items-center space-y-4">
              <img
                src={jogadorSelecionado.foto || "/avatar.png"}
                className="w-32 h-32 object-cover rounded-full border"
              />
              <h2 className="text-xl font-semibold">{jogadorSelecionado.nome}</h2>

              {/* Balizas lado a lado */}
              <div className="flex flex-col md:flex-row gap-6 mt-4 justify-center items-start">
                {/* Penáltis */}
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm w-full max-w-sm">
                  <h3 className="text-lg font-semibold text-center mb-2">Mapa de Penáltis</h3>
                  <div className="mb-4 text-center">
                    <select
                      value={filtroPenaltis}
                      onChange={(e) => setFiltroPenaltis(e.target.value as any)}
                      className="border px-3 py-1 rounded"
                    >
                      <option value="todos">Todos</option>
                      <option value="golo">Golos</option>
                      <option value="falhado">Falhados</option>
                    </select>
                  </div>
                  <BalizaHeatmap dados={mapaPenaltis} filtro={filtroPenaltis} />
                </div>

                {/* Livres Diretos */}
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm w-full max-w-sm">
                  <h3 className="text-lg font-semibold text-center mb-2">Mapa de Livres Diretos</h3>
                  <div className="mb-4 text-center">
                    <select
                      value={filtroLivres}
                      onChange={(e) => setFiltroLivres(e.target.value as any)}
                      className="border px-3 py-1 rounded"
                    >
                      <option value="todos">Todos</option>
                      <option value="golo">Golos</option>
                      <option value="falhado">Falhados</option>
                    </select>
                  </div>
                  <BalizaHeatmap dados={mapaLivres} filtro={filtroLivres} />
                </div>
              </div>


            </div>


            <div className="mt-6 text-center">
              <button
                onClick={() => setModalJogadorAberto(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default DetalheEquipa;
