import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Edit, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom"; // certifica-te que está no topo




const camposGolos = [
  "Ataque Organizado",
  "Ataque Rápido",
  "Penálti",
  "Recarga Penálti",
  "Livre Direto",
  "Recarga Livre Direto",
  "Power Play",
  "Under Play"
];

const Analise2Divisao = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [epocaSelecionada, setEpocaSelecionada] = useState("2025-26");
  const [abaAtiva, setAbaAtiva] = useState("equipas");
  const [epocasDisponiveis, setEpocasDisponiveis] = useState<string[]>([]);
  const [equipas, setEquipas] = useState<any[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoLogo, setNovoLogo] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [equipaSelecionadaId, setEquipaSelecionadaId] = useState<string | null>(null);
  const [modalBolasParadasAberto, setModalBolasParadasAberto] = useState(false);
  const [jogoSelecionadoBolas, setJogoSelecionadoBolas] = useState<any | null>(null);


  const [modalPlantelAberto, setModalPlantelAberto] = useState(false);
  const [jogadores, setJogadores] = useState<any[]>([]);
  const [jogadorEditando, setJogadorEditando] = useState<any | null>(null);
  const [formJogador, setFormJogador] = useState({
    nome: "",
    numero: "",
    posicao: "",
    idade: "",
    nacionalidade: "",
    foto: ""
  });

  const [mostrarFormularioJogador, setMostrarFormularioJogador] = useState(false);

  const adicionarOuEditarJogo = (numeroJornada: number) => {
    if (!novoJogo.casa || !novoJogo.fora) {
      alert("Seleciona as duas equipas!");
      return;
    }
    if (novoJogo.casa === novoJogo.fora) {
      alert("As equipas devem ser diferentes!");
      return;
    }

    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const jornadasAtualizadas = [...jornadas];
    const index = jornadasAtualizadas.findIndex(j => j.numero === numeroJornada);

    const equipaCasa = equipas.find(e => e.nome === novoJogo.casa);
    const equipaFora = equipas.find(e => e.nome === novoJogo.fora);

    const jogoFormatado = {
      ...novoJogo,
      logoCasa: equipaCasa?.logoUrl || "",
      logoFora: equipaFora?.logoUrl || ""
    };

    if (index !== -1) {
      if (jogoEditandoIndex !== null) {
        jornadasAtualizadas[index].jogos[jogoEditandoIndex] = jogoFormatado;
      } else {
        jornadasAtualizadas[index].jogos.push(jogoFormatado);
      }
      guardarJornadas(jornadasAtualizadas);
      setNovoJogo({ casa: "", fora: "", data: "", golosCasa: "", golosFora: "", logoCasa: "", logoFora: "" });
      setJornadaSelecionada(null);
      setJogoEditandoIndex(null);
    }
  };

  const [modalEstatisticasAberto, setModalEstatisticasAberto] = useState(false);
  const [estatisticasJogo, setEstatisticasJogo] = useState<any | null>(null);






  useEffect(() => {
    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    setEpocasDisponiveis(Object.keys(dadosGuardados));

    if (Object.keys(dadosGuardados).length === 0) {
      localStorage.setItem("epocas", JSON.stringify({ "2025-26": { equipas: [], jornadas: [] } }));
      setEpocasDisponiveis(["2025-26"]);
      setEpocaSelecionada("2025-26");
    } else {
      carregarEquipas(dadosGuardados, epocaSelecionada);
    }
  }, []);

  useEffect(() => {
    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    carregarEquipas(dadosGuardados, epocaSelecionada);
  }, [epocaSelecionada]);

  const carregarEquipas = (dados: any, epoca: string) => {
    setEquipas(dados[epoca]?.equipas || []);
  };

  if (loading || !user) return null;

  const criarNovaEpoca = () => {
    const novaEpoca = prompt("Digite o nome da nova época (ex: 2026-27)");
    if (!novaEpoca) return;

    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    if (dadosGuardados[novaEpoca]) {
      alert("Essa época já existe!");
      return;
    }

    dadosGuardados[novaEpoca] = { equipas: [], jornadas: [] };
    localStorage.setItem("epocas", JSON.stringify(dadosGuardados));
    setEpocasDisponiveis(Object.keys(dadosGuardados));
    setEpocaSelecionada(novaEpoca);
  };

  const salvarNovaEquipa = () => {
    if (!novoNome || !novoLogo) {
      alert("Preencha todos os campos!");
      return;
    }

    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");

    if (modoEdicao && equipaSelecionadaId) {
      const index = dadosGuardados[epocaSelecionada].equipas.findIndex((e: any) => e.id === equipaSelecionadaId);
      if (index !== -1) {
        dadosGuardados[epocaSelecionada].equipas[index].nome = novoNome;
        dadosGuardados[epocaSelecionada].equipas[index].logoUrl = novoLogo;
      }
    } else {
      const novaEquipa = {
        id: uuidv4(),
        nome: novoNome,
        logoUrl: novoLogo,
        plantel: []
      };
      dadosGuardados[epocaSelecionada].equipas.push(novaEquipa);
    }

    localStorage.setItem("epocas", JSON.stringify(dadosGuardados));
    carregarEquipas(dadosGuardados, epocaSelecionada);
    setMostrarModal(false);
    setNovoNome("");
    setNovoLogo(null);
    setModoEdicao(false);
    setEquipaSelecionadaId(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNovoLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const editarEquipa = (equipa: any) => {
    setModoEdicao(true);
    setEquipaSelecionadaId(equipa.id);
    setNovoNome(equipa.nome);
    setNovoLogo(equipa.logoUrl);
    setMostrarModal(true);
  };

  const eliminarEquipa = (id: string) => {
    if (!window.confirm("Tens a certeza que queres eliminar esta equipa?")) return;

    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    dadosGuardados[epocaSelecionada].equipas = dadosGuardados[epocaSelecionada].equipas.filter((e: any) => e.id !== id);

    localStorage.setItem("epocas", JSON.stringify(dadosGuardados));
    carregarEquipas(dadosGuardados, epocaSelecionada);
  };

  const abrirPlantel = (equipa: any) => {
    setEquipaSelecionadaId(equipa.id);
    setJogadores(equipa.plantel || []);
    setModalPlantelAberto(true);
  };

  const guardarJogador = () => {
    const { nome, numero, posicao, idade, nacionalidade, foto } = formJogador;
    if (!nome || !posicao || !idade || !nacionalidade) {
      alert("Preencha todos os campos do jogador!");
      return;
    }

    const novoJogador = {
      id: jogadorEditando?.id || uuidv4(),
      nome,
      numero,
      posicao,
      idade: Number(idade),
      nacionalidade,
      foto
    };


    let novosJogadores;
    if (jogadorEditando) {
      novosJogadores = jogadores.map(j => j.id === jogadorEditando.id ? novoJogador : j);
    } else {
      novosJogadores = [...jogadores, novoJogador];
    }

    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const indexEquipa = dadosGuardados[epocaSelecionada].equipas.findIndex((e: any) => e.id === equipaSelecionadaId);
    if (indexEquipa !== -1) {
      dadosGuardados[epocaSelecionada].equipas[indexEquipa].plantel = novosJogadores;
      localStorage.setItem("epocas", JSON.stringify(dadosGuardados));
      setJogadores(novosJogadores);
      setJogadorEditando(null);
      setFormJogador({ nome: "", numero: "", posicao: "", idade: "", nacionalidade: "", foto: "" });
      setMostrarFormularioJogador(false);
    }
  };


  const apagarJogador = (id: string) => {
    if (!window.confirm("Eliminar este jogador?")) return;
    const novosJogadores = jogadores.filter(j => j.id !== id);
    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}")
    const indexEquipa = dadosGuardados[epocaSelecionada].equipas.findIndex((e: any) => e.id === equipaSelecionadaId);
    if (indexEquipa !== -1) {
      dadosGuardados[epocaSelecionada].equipas[indexEquipa].plantel = novosJogadores;
      localStorage.setItem("epocas", JSON.stringify(dadosGuardados));
      setJogadores(novosJogadores);
    }
  };

  const iniciarEditarJogador = (jogador: any) => {
    setJogadorEditando(jogador);
    setFormJogador({ nome: "", numero: "", posicao: "", idade: "", nacionalidade: "", foto: "" });

  };

  const iniciarNovoJogador = () => {
    setJogadorEditando(null);
    setFormJogador({ nome: "", numero: "", posicao: "", idade: "", nacionalidade: "", foto: "" });

    setMostrarFormularioJogador(true);
  };

  const [jornadas, setJornadas] = useState<any[]>([]);
  const [jornadaSelecionada, setJornadaSelecionada] = useState<number | null>(null);
  const [novoJogo, setNovoJogo] = useState({
    casa: "",
    fora: "",
    data: "",
    golosCasa: "",
    golosFora: "",
    logoCasa: "",  // 🆕
    logoFora: ""   // 🆕
  });

  const [jogoEditandoIndex, setJogoEditandoIndex] = useState<number | null>(null);


  useEffect(() => {
    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    carregarEquipas(dadosGuardados, epocaSelecionada);
    setJornadas(dadosGuardados[epocaSelecionada]?.jornadas || []);
  }, [epocaSelecionada]);

  const guardarJornadas = (novasJornadas: any[]) => {
    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    dadosGuardados[epocaSelecionada].jornadas = novasJornadas;
    localStorage.setItem("epocas", JSON.stringify(dadosGuardados));
    setJornadas(novasJornadas);
  };

  const criarNovaJornada = () => {
    const novoNumero = jornadas.length + 1;
    const novaJornada = { numero: novoNumero, jogos: [] };
    const atualizadas = [...jornadas, novaJornada];
    guardarJornadas(atualizadas);
  };

  const eliminarJornada = (numero: number) => {
    if (!window.confirm("Eliminar esta jornada completa?")) return;
    const atualizadas = jornadas.filter(j => j.numero !== numero);
    guardarJornadas(atualizadas);
  };

  const eliminarJogo = (numeroJornada: number, indexJogo: number) => {
    if (!window.confirm("Eliminar este jogo?")) return;

    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const jornadasAtualizadas = [...jornadas];
    const index = jornadasAtualizadas.findIndex(j => j.numero === numeroJornada);

    if (index !== -1) {
      jornadasAtualizadas[index].jogos.splice(indexJogo, 1);
      guardarJornadas(jornadasAtualizadas);
    }
  };

  const editarJogo = (numeroJornada: number, jogo: any, indexJogo: number) => {
    setJornadaSelecionada(numeroJornada);
    setNovoJogo({
      casa: jogo.casa,
      fora: jogo.fora,
      data: jogo.data || "",
      golosCasa: jogo.golosCasa || "",
      golosFora: jogo.golosFora || "",
      logoCasa: jogo.logoCasa || "",
      logoFora: jogo.logoFora || ""
    });
    setJogoEditandoIndex(indexJogo);
  };

  const adicionarEstatisticas = (numeroJornada: number, jogo: any, indexJogo: number) => {
    setEstatisticasJogo({
      jornada: numeroJornada,
      index: indexJogo,
      dados: jogo.estatisticas || {
        casa: {},
        fora: {},
        golosCasa: 0,
        golosFora: 0,
      }
    });
    setModalEstatisticasAberto(true);
  };


  const estatKeys = [
    "Ataque Organizado",
    "Ataque Rápido",
    "Penálti",
    "Recarga Penálti",
    "Livre Direto",
    "Recarga Livre Direto",
    "Power Play",
    "Under Play",
    "Penálti Falhado",
    "Livre Direto Falhado",
    "Faltas de Equipa",
    "Cartão Azul",
    "Cartão Vermelho"
  ];

  const guardarEstatisticas = () => {
    if (!estatisticasJogo) return;

    const dadosGuardados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const jornadasAtualizadas = [...jornadas];

    const indexJornada = jornadasAtualizadas.findIndex(j => j.numero === estatisticasJogo.jornada);
    if (indexJornada !== -1) {
      const jogoAtual = jornadasAtualizadas[indexJornada].jogos[estatisticasJogo.index];

      // Estes são os campos que somam golos
      const camposGolos = [
        "Ataque Organizado",
        "Ataque Rápido",
        "Penálti",
        "Recarga Penálti",
        "Livre Direto",
        "Recarga Livre Direto",
        "Power Play",
        "Under Play"
      ];

      const totalCasa = camposGolos.reduce((soma, chave) => soma + (estatisticasJogo.dados.casa[chave] || 0), 0);
      const totalFora = camposGolos.reduce((soma, chave) => soma + (estatisticasJogo.dados.fora[chave] || 0), 0);

      // Atualiza o resultado no jogo
      jogoAtual.golosCasa = totalCasa;
      jogoAtual.golosFora = totalFora;

      // Atualiza também as estatísticas
      jogoAtual.estatisticas = estatisticasJogo.dados;

      // Salva tudo
      dadosGuardados[epocaSelecionada].jornadas = jornadasAtualizadas;
      localStorage.setItem("epocas", JSON.stringify(dadosGuardados));
      setJornadas(jornadasAtualizadas);
      setModalEstatisticasAberto(false);
    }
  };

  const equipaCasa = equipas.find(e => e.nome === jogoSelecionadoBolas?.jogo?.casa);
  const equipaFora = equipas.find(e => e.nome === jogoSelecionadoBolas?.jogo?.fora);

  const [zonaCasaSelecionada, setZonaCasaSelecionada] = useState("");
  const [zonaForaSelecionada, setZonaForaSelecionada] = useState("");

  const [bolasParadasCasa, setBolasParadasCasa] = useState<any[]>([]);
  const [bolasParadasFora, setBolasParadasFora] = useState<any[]>([]);
  const [bolasParadasCasaGuardadas, setBolasParadasCasaGuardadas] = useState<any[]>([]);
  const [bolasParadasForaGuardadas, setBolasParadasForaGuardadas] = useState<any[]>([]);

  const guardarTodasBolasParadas = () => {
    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];

    if (!dados[epoca]) return;

    // Percorrer todas as jornadas e jogos para encontrar o jogo certo
    dados[epoca].jornadas.forEach((jornada: any) => {
      jornada.jogos.forEach((jogo: any) => {
        const mesmoJogo =
          jogo.casa === jogoSelecionadoBolas.jogo.casa &&
          jogo.fora === jogoSelecionadoBolas.jogo.fora &&
          jogo.data === jogoSelecionadoBolas.jogo.data;

        if (mesmoJogo) {
          jogo.bolasParadas = [
            ...bolasParadasCasaGuardadas,
            ...bolasParadasForaGuardadas
          ];
        }
      });
    });

    // Guardar no localStorage
    localStorage.setItem("epocas", JSON.stringify(dados));

    // Fechar o modal (opcional)
    fecharModalBolasParadas();
  };




  const adicionarBolaParadaCasa = () => {
    setBolasParadasCasa([
      ...bolasParadasCasa,
      {
        tipo: "",
        jogador: "",
        resultado: "",
        zona: "",
        recarga: "",             // "Sim" ou "Não"
        resultadoRecarga: ""     // "Golo", "Defendido", "Falhado"
      }

    ]);
  };

  const atualizarBolaParadaCasa = (index: number, campo: string, valor: string) => {
    const novas = [...bolasParadasCasa];
    novas[index][campo] = valor;
    setBolasParadasCasa(novas);
  };

  const atualizarZonaCasa = (index: number, zona: string) => {
    const novas = [...bolasParadasCasa];
    novas[index].zona = zona;
    setBolasParadasCasa(novas);
    setZonaCasaSelecionada(zona);
  };

  const adicionarBolaParadaFora = () => {
    setBolasParadasFora([
      ...bolasParadasFora,
      {
        tipo: "",
        jogador: "",
        resultado: "",
        zona: "",
        recarga: "",             // "Sim" ou "Não"
        resultadoRecarga: ""     // "Golo", "Defendido", "Falhado"
      }

    ]);
  };

  const atualizarBolaParadaFora = (index: number, campo: string, valor: string) => {
    const novas = [...bolasParadasFora];
    novas[index][campo] = valor;
    setBolasParadasFora(novas);
  };

  const atualizarZonaFora = (index: number, zona: string) => {
    const novas = [...bolasParadasFora];
    novas[index].zona = zona;
    setBolasParadasFora(novas);
    setZonaForaSelecionada(zona);
  };

  const zonasBaliza = [
    // Baliza
    { name: "Canto Superior Esquerdo", top: "21%", left: "12.5%", width: "12.5%", height: "14%" },
    { name: "Centro Superior", top: "21%", left: "25.5%", width: "40.5%", height: "14%" },
    { name: "Canto Superior Direito", top: "21%", left: "66.5%", width: "21.7%", height: "14%" },
    { name: "Meia Altura Esquerdo", top: "36%", left: "12.5%", width: "12.5%", height: "34%" },
    { name: "Meio da Baliza", top: "36%", left: "25.5%", width: "40.5%", height: "24%" },
    { name: "Meio da Baliza", top: "60%", left: "36.5%", width: "29.5%", height: "10%" },
    { name: "Sovaco", top: "60.5%", left: "25.5%", width: "10.5%", height: "10%" },
    { name: "Meia Altura Direito", top: "36%", left: "66.5%", width: "21.8%", height: "34.5%" },
    { name: "Canto Inferior Esquero", top: "70.5%", left: "12.5%", width: "12.5%", height: "13%" },
    { name: "Centro Inferior Rasteiro", top: "70.5%", left: "25.5%", width: "40.5%", height: "13%" },
    { name: "Canto Inferior Direito", top: "70.5%", left: "66.5%", width: "21.8%", height: "13%" },
    // Postes
    { name: "Barra Superior Esquerdo", top: "17%", left: "9.5%", width: "15.5%", height: "3%" },
    { name: "Barra Superior Meio", top: "17%", left: "25.5%", width: "40.5%", height: "3%" },
    { name: "Barra Superior Direito", top: "17%", left: "66.5%", width: "24%", height: "3%" },
    { name: "Poste Superior Esquerdo", top: "21%", left: "9.5%", width: "2.5%", height: "14%" },
    { name: "Posts Meia Altura Esquerdo", top: "36%", left: "9.5%", width: "2.5%", height: "34%" },
    { name: "Poste Inferior Esquerdo", top: "70.5%", left: "9.5%", width: "2.5%", height: "12%" },
    { name: "Poste Superior Direito", top: "21%", left: "88.5%", width: "2%", height: "14%" },
    { name: "Poste Meia Altura Direito", top: "36%", left: "88.5%", width: "2%", height: "34%" },
    { name: "Poste Inferior Direito", top: "70.5%", left: "88.5%", width: "2%", height: "12%" },
    // Fora
    { name: "Fora Superior Barra Esquerdo", top: "10%", left: "4.5%", width: "20.5%", height: "6.5%" },
    { name: "Fora Superior Barra Meio", top: "10%", left: "25.5%", width: "40.5%", height: "6.5%" },
    { name: "Fora Superior Barra Direito", top: "10%", left: "66.5%", width: "29.5%", height: "6.5%" },
    { name: "Fora Superior Esquerdo", top: "17%", left: "4.5%", width: "4.5%", height: "18%" },
    { name: "Fora Meia Altura Esquerdo", top: "36%", left: "4.5%", width: "4.5%", height: "34%" },
    { name: "Fora Inferior Esquerdo", top: "70.5%", left: "4.5%", width: "4.5%", height: "12.5%" },
    { name: "Fora Superior Direito", top: "17%", left: "91%", width: "5%", height: "18%" },
    { name: "Fora Meia Altura Direito", top: "36%", left: "91%", width: "5%", height: "34%" },
    { name: "Fora Inferior Direito", top: "70.5%", left: "91%", width: "5%", height: "12.5%" },
  ];

  const fecharModalBolasParadas = () => {
    setModalBolasParadasAberto(false);
    setBolasParadasCasa([]);
    setBolasParadasFora([]);
    setZonaCasaSelecionada("");
    setZonaForaSelecionada("");
    setJogoSelecionadoBolas(null);
    setBolasParadasCasaGuardadas([]);
    setBolasParadasForaGuardadas([]);

  };

  const removerBolaParadaCasa = (index: number) => {
    const novas = bolasParadasCasa.filter((_, i) => i !== index);
    setBolasParadasCasa(novas);
  };

  const removerBolaParadaFora = (index: number) => {
    const novas = bolasParadasCasa.filter((_, i) => i !== index);
    setBolasParadasFora(novas);
  };

  const guardarBolaParadaCasa = (index: number) => {
    const bola = bolasParadasCasa[index];

    if (!bola.tipo || !bola.jogador || !bola.resultado) {
      alert("Preenche os campos obrigatórios.");
      return;
    }

    // Atualizar localStorage
    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];
    const jornadas = dados[epoca]?.jornadas || [];

    jornadas.forEach((jornada: any) => {
      jornada.jogos.forEach((jogo: any) => {
        if (
          jogo.casa === jogoSelecionadoBolas.jogo?.casa &&
          jogo.fora === jogoSelecionadoBolas.jogo?.fora
        ) {
          if (!jogo.bolasParadas) jogo.bolasParadas = [];
          jogo.bolasParadas.push(bola);
        }
      });
    });

    localStorage.setItem("epocas", JSON.stringify(dados));

    // Atualiza estado local
    setBolasParadasCasaGuardadas(prev => [...prev, bola]);
    setBolasParadasCasa(prev => prev.filter((_, i) => i !== index));
  };

  const editarBolaParadaCasa = (index: number) => {
    const bola = bolasParadasCasaGuardadas[index];
    setBolasParadasCasa(prev => [...prev, bola]); // Reenvia para edição
    setBolasParadasCasaGuardadas(prev => prev.filter((_, i) => i !== index)); // Remove dos guardados
  };

  const eliminarBolaParadaCasa = (index: number) => {
    if (!window.confirm("Eliminar esta bola parada?")) return;
    setBolasParadasCasaGuardadas(prev => prev.filter((_, i) => i !== index));
  };


  const guardarBolaParadaFora = (index: number) => {
    const bola = bolasParadasFora[index];

    if (!bola.tipo || !bola.jogador || !bola.resultado) {
      alert("Preenche os campos obrigatórios.");
      return;
    }

    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];
    const jornadas = dados[epoca]?.jornadas || [];

    jornadas.forEach((jornada: any) => {
      jornada.jogos.forEach((jogo: any) => {
        if (
          jogo.casa === jogoSelecionadoBolas.jogo?.casa &&
          jogo.fora === jogoSelecionadoBolas.jogo?.fora
        ) {
          if (!jogo.bolasParadas) jogo.bolasParadas = [];
          jogo.bolasParadas.push(bola);
        }
      });
    });

    localStorage.setItem("epocas", JSON.stringify(dados));

    setBolasParadasForaGuardadas(prev => [...prev, bola]);
    setBolasParadasFora(prev => prev.filter((_, i) => i !== index));
  };


  const eliminarBolaParadaFora = (index: number) => {
    if (!window.confirm("Eliminar esta bola parada?")) return;
    setBolasParadasForaGuardadas(prev => prev.filter((_, i) => i !== index));

    // Também remove do localStorage:
    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];

    dados[epoca].jornadas.forEach((jornada: any) => {
      jornada.jogos.forEach((jogo: any) => {
        if (
          jogo.casa === jogoSelecionadoBolas.jogo?.casa &&
          jogo.fora === jogoSelecionadoBolas.jogo?.fora
        ) {
          if (jogo.bolasParadas) {
            jogo.bolasParadas = jogo.bolasParadas.filter((_, i) => i !== index);
          }
        }
      });
    });

    localStorage.setItem("epocas", JSON.stringify(dados));
  };




  const formatarResultado = (resultado: string, resultadoRecarga: string | undefined) => {
    if (resultado === "Golo Marcado" || resultado === "Golo") return "marcou";
    if (resultado === "Defendido") return "defendeu";
    if (resultado === "Golo Sofrido") return "sofreu golo";
    if (resultado === "Falhado") {
      if (resultadoRecarga === "Golo") return "falhou, mas marcou na recarga";
      if (resultadoRecarga === "Defendido") return "falhou e a recarga foi defendida";
      if (resultadoRecarga === "Falhado") return "falhou e a recarga também foi falhada";
      return "falhou";
    }
    return resultado.toLowerCase();
  };

  useEffect(() => {
    if (!modalBolasParadasAberto || !jogoSelecionadoBolas) return;

    const dados = JSON.parse(localStorage.getItem("epocas") || "{}");
    const epoca = Object.keys(dados)[0];

    const jogoGuardado = dados[epoca]?.jornadas
      .find((j: any) => j.numero === jogoSelecionadoBolas.jornada)
      ?.jogos.find(
        (j: any) =>
          j.casa === jogoSelecionadoBolas.jogo.casa &&
          j.fora === jogoSelecionadoBolas.jogo.fora &&
          j.data === jogoSelecionadoBolas.jogo.data
      );

    const bolas = jogoGuardado?.bolasParadas || [];

    const casa = bolas.filter((b: any) => b.jogador && b.tipo && equipaCasa?.plantel?.some((p: any) => p.nome === b.jogador));
    const fora = bolas.filter((b: any) => b.jogador && b.tipo && equipaFora?.plantel?.some((p: any) => p.nome === b.jogador));

    setBolasParadasCasaGuardadas(casa);
    setBolasParadasForaGuardadas(fora);
  }, [modalBolasParadasAberto, jogoSelecionadoBolas]);





  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <img src="/logo_clube.png" alt="Logo" className="h-10" />
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-700 font-medium">{user?.nome}</span>
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

      {/* Botão de voltar */}
      <div className="px-4 pt-4">
        <button
          onClick={() => navigate("/analistas")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          ← Voltar
        </button>
      </div>


      {/* Seletor de época */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <select
            value={epocaSelecionada}
            onChange={(e) => setEpocaSelecionada(e.target.value)}
            className="border p-2 rounded"
          >
            {epocasDisponiveis.map((epoca) => (
              <option key={epoca} value={epoca}>{epoca}</option>
            ))}
          </select>
          <button
            onClick={criarNovaEpoca}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Nova Época
          </button>
        </div>
      </div>

      {/* Tabs de navegação */}
      <div className="p-4 flex gap-4">
        <button
          onClick={() => setAbaAtiva("equipas")}
          className={`px-4 py-2 rounded ${abaAtiva === "equipas" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Equipas
        </button>
        <button
          onClick={() => setAbaAtiva("jornadas")}
          className={`px-4 py-2 rounded ${abaAtiva === "jornadas" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Jornadas
        </button>
        <button
          onClick={() => setAbaAtiva("estatisticas")}
          className={`px-4 py-2 rounded ${abaAtiva === "estatisticas" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Estatísticas
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="p-6">
        {abaAtiva === "equipas" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => { setMostrarModal(true); setModoEdicao(false); setNovoNome(""); setNovoLogo(null); }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Nova Equipa
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {equipas.map((equipa) => (
                <div
                  key={equipa.id}
                  onClick={() => navigate(`/equipa/${equipa.id}`)}
                  className="bg-white p-4 rounded shadow flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                >
                  <img src={equipa.logoUrl} alt={equipa.nome} className="w-20 h-20 object-cover rounded-md" />
                  <span className="font-semibold text-gray-800 mb-2">{equipa.nome}</span>
                  <div className="flex gap-2">
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); editarEquipa(equipa); }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); eliminarEquipa(equipa.id); }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); abrirPlantel(equipa); }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Users size={20} />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaAtiva === "jornadas" && (
          <>
            {/* Botão Nova Jornada - fora da grelha */}
            <div className="p-4 flex justify-end">
              <button
                onClick={criarNovaJornada}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Nova Jornada
              </button>
            </div>

            {/* Grelha de jornadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-4">
              {jornadas.length === 0 ? (
                <p className="text-gray-500 col-span-full">Ainda não há jornadas criadas.</p>
              ) : (
                jornadas.map((jornada) => (
                  <div key={jornada.numero} className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">Jornada {jornada.numero}</h3>
                      <button
                        onClick={() => eliminarJornada(jornada.numero)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Eliminar Jornada
                      </button>
                    </div>

                    {jornada.jogos.length === 0 ? (
                      <p className="text-sm text-gray-400">Nenhum jogo adicionado.</p>
                    ) : (
                      <ul className="space-y-3">
                        {jornada.jogos.map((jogo: any, index: number) => (
                          <li key={index} className="border rounded p-2 bg-gray-100 shadow-sm">
                            <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-4">
                              {/* Equipa da Casa */}
                              <div className="flex items-center justify-end gap-2">
                                <img src={jogo.logoCasa} alt={jogo.casa} className="w-8 h-8 object-cover" />
                                <span className="font-medium">{jogo.casa}</span>
                              </div>

                              {/* Resultado */}
                              <div className="text-center font-bold text-gray-700 text-lg">
                                {jogo.golosCasa ?? "-"} : {jogo.golosFora ?? "-"}
                              </div>

                              {/* Equipa de Fora */}
                              <div className="flex items-center justify-start gap-2">
                                <span className="font-medium">{jogo.fora}</span>
                                <img src={jogo.logoFora} alt={jogo.fora} className="w-8 h-8 object-cover" />
                              </div>

                              {/* Botões de ação */}
                              <div className="flex items-center gap-2 justify-end">
                                <button onClick={() => editarJogo(jornada.numero, jogo, index)} className="text-blue-500">✏️</button>
                                <button onClick={() => eliminarJogo(jornada.numero, index)} className="text-red-500">🗑️</button>
                                <button onClick={() => adicionarEstatisticas(jornada.numero, jogo, index)} className="text-purple-500">📊</button>
                                <button
                                  onClick={() => {
                                    setJogoSelecionadoBolas({ jornada: jornada.numero, index: index, jogo });
                                    setModalBolasParadasAberto(true);
                                  }}
                                  className="text-yellow-500"
                                >
                                  🎯
                                </button>


                              </div>
                            </div>
                          </li>


                        ))}
                      </ul>
                    )}

                    {/* Formulário de novo/editar jogo */}
                    {jornadaSelecionada === jornada.numero ? (
                      <div className="mt-2 space-y-2">
                        <select
                          value={novoJogo.casa}
                          onChange={(e) => setNovoJogo({ ...novoJogo, casa: e.target.value })}
                          className="border p-2 rounded w-full"
                        >
                          <option value="">Seleciona Equipa da Casa</option>
                          {equipas.map((e: any) => (
                            <option key={e.id} value={e.nome}>{e.nome}</option>
                          ))}
                        </select>

                        <select
                          value={novoJogo.fora}
                          onChange={(e) => setNovoJogo({ ...novoJogo, fora: e.target.value })}
                          className="border p-2 rounded w-full"
                        >
                          <option value="">Seleciona Equipa Visitante</option>
                          {equipas.map((e: any) => (
                            <option key={e.id} value={e.nome}>{e.nome}</option>
                          ))}
                        </select>

                        <input
                          type="date"
                          value={novoJogo.data}
                          onChange={(e) => setNovoJogo({ ...novoJogo, data: e.target.value })}
                          className="border p-2 rounded w-full"
                        />

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setJornadaSelecionada(null);
                              setJogoEditandoIndex(null);
                              setNovoJogo({ casa: "", fora: "", data: "", golosCasa: "", golosFora: "", logoCasa: "", logoFora: "" });
                            }}
                            className="px-4 py-2 bg-gray-300 rounded"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => adicionarOuEditarJogo(jornada.numero)}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                          >
                            {jogoEditandoIndex !== null ? "Atualizar Jogo" : "Guardar Jogo"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => {
                            setJornadaSelecionada(jornada.numero);
                            setJogoEditandoIndex(null);
                            setNovoJogo({ casa: "", fora: "", data: "", golosCasa: "", golosFora: "", logoCasa: "", logoFora: "" });
                          }}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          + Novo Jogo
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}


        {abaAtiva === "estatisticas" && <div>🟣 Estatísticas da Época ({epocaSelecionada})</div>}
      </div>

      {/* Modal Jogadores */}
      {modalPlantelAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Plantel</h2>
            <ul className="mb-4 max-h-64 overflow-y-auto">
              {jogadores.map((jogador) => (
                <li key={jogador.id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <strong>{jogador.nome}</strong> - {jogador.posicao} ({jogador.idade} anos, {jogador.nacionalidade})
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => iniciarEditarJogador(jogador)} className="text-blue-500">✏️</button>
                    <button onClick={() => apagarJogador(jogador.id)} className="text-red-500">🗑️</button>
                  </div>
                </li>
              ))}
            </ul>

            {mostrarFormularioJogador && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">{jogadorEditando ? "Editar Jogador" : "Novo Jogador"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={formJogador.nome}
                    onChange={(e) => setFormJogador({ ...formJogador, nome: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Nº Camisola"
                    value={formJogador.numero}
                    onChange={(e) => setFormJogador({ ...formJogador, numero: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Posição"
                    value={formJogador.posicao}
                    onChange={(e) => setFormJogador({ ...formJogador, posicao: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Idade"
                    value={formJogador.idade}
                    onChange={(e) => setFormJogador({ ...formJogador, idade: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Nacionalidade"
                    value={formJogador.nacionalidade}
                    onChange={(e) => setFormJogador({ ...formJogador, nacionalidade: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormJogador({ ...formJogador, foto: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="border p-2 rounded"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setMostrarFormularioJogador(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancelar
                  </button>
                  <button onClick={guardarJogador} className="px-4 py-2 bg-blue-600 text-white rounded">
                    Guardar
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => { setModalPlantelAberto(false); setMostrarFormularioJogador(false); }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Fechar
              </button>

              <button
                onClick={iniciarNovoJogador}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                + Novo Jogador
              </button>
            </div>

          </div>
        </div>
      )}

      {modalEstatisticasAberto && estatisticasJogo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Estatísticas do Jogo</h2>

            {(() => {
              const jogoSelecionado = jornadas.find(j => j.numero === estatisticasJogo.jornada)?.jogos[estatisticasJogo.index];
              const logoUrlCasa = jogoSelecionado?.logoCasa;
              const logoUrlFora = jogoSelecionado?.logoFora;
              const nomeEquipaCasa = jogoSelecionado?.casa;
              const nomeEquipaFora = jogoSelecionado?.fora;

              return (
                <>
                  {/* Cabeçalho com Logos + Resultado */}
                  <div className="grid grid-cols-3 items-center text-center mb-8">
                    {/* Equipa da Casa */}
                    <div className="flex flex-col items-center min-h-[100px] justify-center">
                      <img src={logoUrlCasa} alt={nomeEquipaCasa} className="w-16 h-16 object-cover rounded-full border mb-2" />
                      <h3 className="font-semibold text-center min-h-[24px]">{nomeEquipaCasa}</h3>
                    </div>

                    {/* Resultado */}
                    <div className="flex items-center justify-center text-3xl font-bold text-gray-700">
                      <span>{estatisticasJogo.dados.golosCasa ?? 0} : {estatisticasJogo.dados.golosFora ?? 0}</span>
                    </div>

                    {/* Equipa de Fora */}
                    <div className="flex flex-col items-center min-h-[100px] justify-center">
                      <img src={logoUrlFora} alt={nomeEquipaFora} className="w-16 h-16 object-cover rounded-full border mb-2" />
                      <h3 className="font-semibold text-center min-h-[24px]">{nomeEquipaFora}</h3>
                    </div>
                  </div>

                  {/* Inputs de Estatísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Equipa da Casa */}
                    <div>
                      {estatKeys.map(chave => (
                        <div key={chave} className="flex items-center mb-2">
                          <label className="text-sm w-40">{chave}</label>
                          <input
                            type="number"
                            value={estatisticasJogo.dados.casa[chave] || ""}
                            onChange={(e) => {
                              const valor = Number(e.target.value) || 0;
                              const novo = { ...estatisticasJogo };
                              novo.dados.casa[chave] = valor;

                              if (camposGolos.includes(chave)) {
                                const total = camposGolos.reduce(
                                  (acc, key) => acc + (Number(novo.dados.casa[key]) || 0),
                                  0
                                );
                                novo.dados.golosCasa = total;
                              }

                              setEstatisticasJogo(novo);
                            }}
                            className="border p-1 rounded w-16 text-center"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Equipa de Fora */}
                    <div>
                      {estatKeys.map(chave => (
                        <div key={chave} className="flex items-center mb-2">
                          <label className="text-sm w-40">{chave}</label>
                          <input
                            type="number"
                            value={estatisticasJogo.dados.fora[chave] || ""}
                            onChange={(e) => {
                              const valor = Number(e.target.value) || 0;
                              const novo = { ...estatisticasJogo };
                              novo.dados.fora[chave] = valor;

                              if (camposGolos.includes(chave)) {
                                const total = camposGolos.reduce(
                                  (acc, key) => acc + (Number(novo.dados.fora[key]) || 0),
                                  0
                                );
                                novo.dados.golosFora = total;
                              }

                              setEstatisticasJogo(novo);
                            }}
                            className="border p-1 rounded w-16 text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setModalEstatisticasAberto(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Fechar
              </button>
              <button
                onClick={guardarEstatisticas}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Guardar Estatísticas
              </button>
            </div>
          </div>
        </div>
      )}
      {modalBolasParadasAberto && jogoSelecionadoBolas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">
              📌 Bolas Paradas – {jogoSelecionadoBolas.jogo?.casa} vs {jogoSelecionadoBolas.jogo?.fora}
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Equipa da Casa */}
              <div className="flex flex-col items-center">
                <img src={equipaCasa?.logoUrl} alt={equipaCasa?.nome} className="w-16 h-16 object-cover mb-2" />
                <h3 className="text-black font-bold text-lg">{equipaCasa?.nome}</h3>

                {bolasParadasCasa.length === 0 && (
                  <div className="mb-4">
                    <button
                      onClick={adicionarBolaParadaCasa}
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-400"
                    >
                      + Nova Bola Parada
                    </button>
                  </div>
                )}
                {bolasParadasCasa.map((bola, index) => (
                  <div key={index} className="space-y-4 w-full border-t pt-4">
                    <select
                      className="border p-2 rounded w-full"
                      value={bola.tipo}
                      onChange={(e) => atualizarBolaParadaCasa(index, "tipo", e.target.value)}
                    >
                      <option value="">Tipo de Lance</option>
                      <option value="Penálti">Penálti</option>
                      <option value="Livre Direto">Livre Direto</option>
                    </select>
                    <select
                      className="border p-2 rounded w-full"
                      value={bola.jogador}
                      onChange={(e) => atualizarBolaParadaCasa(index, "jogador", e.target.value)}
                    >
                      <option value="">Jogador</option>
                      {equipaCasa?.plantel?.map((j: any) => (
                        <option key={j.id} value={j.nome}>{j.nome}</option>
                      ))}
                    </select>
                    <select
                      className="border p-2 rounded w-full"
                      value={bola.resultado}
                      onChange={(e) => atualizarBolaParadaCasa(index, "resultado", e.target.value)}
                    >
                      <option value="">Resultado</option>
                      <option value="Golo Marcado">Golo Marcado</option>
                      <option value="Falhado">Falhado</option>
                      <option value="Golo Sofrido">Golo Sofrido</option>
                      <option value="Defendido">Defendido</option>
                    </select>
                    {(bola.resultado === "Falhado" || bola.resultado === "Defendido") && (
                      <>
                        <select
                          className="border p-2 rounded w-full"
                          value={bola.recarga || ""}
                          onChange={(e) => atualizarBolaParadaCasa(index, "recarga", e.target.value)}
                        >
                          <option value="">Recarga realizada?</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                        {bola.recarga === "Sim" && (
                          <select
                            className="border p-2 rounded w-full"
                            value={bola.resultadoRecarga || ""}
                            onChange={(e) => atualizarBolaParadaCasa(index, "resultadoRecarga", e.target.value)}
                          >
                            <option value="">Resultado da Recarga</option>
                            <option value="Golo">Golo</option>
                            <option value="Defendido">Defendido</option>
                            <option value="Falhado">Falhado</option>
                          </select>
                        )}
                      </>
                    )}
                    <div className="w-full">
                      <p className="text-sm font-medium mb-2 text-center">Zona da Baliza</p>
                      {bola.zona && (
                        <p className="text-xs text-gray-500 text-center">
                          Zona selecionada: <span className="font-medium">{bola.zona}</span>
                        </p>
                      )}
                      <div className="relative w-full max-w-[600px] aspect-[4/3] mx-auto">
                        <img src="/baliza.png" alt="Baliza" className="w-full h-full object-contain" />
                        {/* Linhas verticais */}
                        <div className="absolute top-[9%] bottom-[17%] left-[25%] w-[2px] bg-black" />
                        <div className="absolute top-[9%] bottom-[17%] left-[66%] w-[2px] bg-black" />
                        <div className="absolute top-[60%] bottom-[30%] left-[36%] w-[2px] bg-black" />
                        <div className="absolute top-[17%] bottom-[17%] left-[9%] w-[2px] bg-black" />
                        <div className="absolute top-[21%] bottom-[17%] left-[12.1%] w-[2px] bg-black" />
                        <div className="absolute top-[16.5%] bottom-[17%] left-[90.4%] w-[2px] bg-black" />
                        <div className="absolute top-[21%] bottom-[17%] left-[88.1%] w-[2px] bg-black" />
                        <div className="absolute top-[9%] bottom-[17%] left-[96%] w-[2px] bg-black" />
                        <div className="absolute top-[9%] bottom-[17%] left-[4%] w-[2px] bg-black" />

                        {/* Linhas horizontais */}
                        <div className="absolute top-[35%] left-[4%] right-[3.5%] h-[2px] bg-black" />
                        <div className="absolute top-[70%] left-[4%] right-[3.5%] h-[2px] bg-black" />
                        <div className="absolute top-[60%] left-[25%] right-[64%] h-[2px] bg-black" />
                        <div className="absolute top-[83%] left-[4%] right-[3.5%] h-[2px] bg-black" />
                        <div className="absolute top-[16.5%] left-[4%] right-[3.5%] h-[2px] bg-black" />
                        <div className="absolute top-[20%] left-[9%] right-[9.5%] h-[2px] bg-black" />
                        <div className="absolute top-[9%] left-[4%] right-[3.5%] h-[2px] bg-black" />

                        {/* Zonas clicáveis */}
                        {zonasBaliza.map((zona) => (
                          <button
                            key={zona.name}
                            onClick={() => atualizarZonaCasa(index, zona.name)} // ou atualizarZonaFora
                            className="absolute hover:bg-blue-400 hover:opacity-80"
                            style={{
                              top: zona.top,
                              left: zona.left,
                              width: zona.width,
                              height: zona.height,
                            }}
                            title={zona.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 👇 Botões Guardar e Cancelar */}
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => removerBolaParadaCasa(index)}
                        className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => guardarBolaParadaCasa(index)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ))}
                {bolasParadasCasaGuardadas.length > 0 && (
                  <div className="mt-6 w-full">
                    <h4 className="font-semibold mb-2">Bolas Paradas Registadas</h4>
                    <ul className="space-y-1 text-sm">
                      {bolasParadasCasaGuardadas.map((bola, i) => (
                        <li key={i} className="p-1 text-gray-700 flex justify-between items-center">
                          <span>
                            {equipaCasa?.nome} – {bola.jogador}, {formatarResultado(bola.resultado, bola.resultadoRecarga)} {bola.tipo} na zona {bola.zona || "N/A"}
                          </span>
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => eliminarBolaParadaCasa(i)} className="text-red-600 hover:text-red-800" title="Eliminar">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Equipa de Fora */}
              <div className="flex flex-col items-center w-full">
                <img src={equipaFora?.logoUrl} alt={equipaFora?.nome} className="w-16 h-16 object-cover mb-2" />
                <h3 className="text-black font-bold text-lg">{equipaFora?.nome}</h3>

                <div className="mb-4">
                  <button
                    onClick={adicionarBolaParadaFora}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-400"
                  >
                    + Nova Bola Parada
                  </button>
                </div>
                {bolasParadasFora.map((bola, index) => (
                  <div key={index} className="space-y-4 w-full border-t pt-4">
                    {/* Selects */}
                    <select className="border p-2 rounded w-full" value={bola.tipo} onChange={(e) => atualizarBolaParadaFora(index, "tipo", e.target.value)}>
                      <option value="">Tipo de Lance</option>
                      <option value="Penálti">Penálti</option>
                      <option value="Livre Direto">Livre Direto</option>
                    </select>

                    <select className="border p-2 rounded w-full" value={bola.jogador} onChange={(e) => atualizarBolaParadaFora(index, "jogador", e.target.value)}>
                      <option value="">Jogador</option>
                      {equipaFora?.plantel?.map((j: any) => (
                        <option key={j.id} value={j.nome}>{j.nome}</option>
                      ))}
                    </select>

                    <select
                      className="border p-2 rounded w-full"
                      value={bola.resultado}
                      onChange={(e) => atualizarBolaParadaFora(index, "resultado", e.target.value)}
                    >
                      <option value="">Resultado</option>
                      <option value="Golo Marcado">Golo Marcado</option>
                      <option value="Falhado">Falhado</option>
                      <option value="Golo Sofrido">Golo Sofrido</option>
                      <option value="Defendido">Defendido</option>
                    </select>

                    {(bola.resultado === "Falhado" || bola.resultado === "Defendido") && (
                      <>
                        <select className="border p-2 rounded w-full" value={bola.recarga || ""} onChange={(e) => atualizarBolaParadaFora(index, "recarga", e.target.value)}>
                          <option value="">Recarga realizada?</option>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>

                        {bola.recarga === "Sim" && (
                          <select className="border p-2 rounded w-full" value={bola.resultadoRecarga || ""} onChange={(e) => atualizarBolaParadaFora(index, "resultadoRecarga", e.target.value)}>
                            <option value="">Resultado da Recarga</option>
                            <option value="Golo">Golo</option>
                            <option value="Defendido">Defendido</option>
                            <option value="Falhado">Falhado</option>
                          </select>
                        )}
                      </>
                    )}

                    {/* Zona da Baliza */}
                    <div className="w-full">
                      <p className="text-sm font-medium mb-2 text-center">Zona da Baliza</p>
                      {bola.zona && (
                        <p className="text-xs text-gray-500 text-center">
                          Zona selecionada: <span className="font-medium">{bola.zona}</span>
                        </p>
                      )}
                      <div className="relative w-full max-w-[600px] aspect-[4/3] mx-auto">
                        <img src="/baliza.png" alt="Baliza" className="w-full h-full object-contain" />

                        {/* Linhas verticais */}
                        <div className="absolute top-[9%] bottom-[17%] left-[25%] w-[2px] bg-black" />
                        <div className="absolute top-[9%] bottom-[17%] left-[66%] w-[2px] bg-black" />
                        <div className="absolute top-[60%] bottom-[30%] left-[36%] w-[2px] bg-black" />
                        <div className="absolute top-[17%] bottom-[17%] left-[9%] w-[2px] bg-black" />
                        <div className="absolute top-[21%] bottom-[17%] left-[12.1%] w-[2px] bg-black" />
                        <div className="absolute top-[16.5%] bottom-[17%] left-[90.4%] w-[2px] bg-black" />
                        <div className="absolute top-[21%] bottom-[17%] left-[88.1%] w-[2px] bg-black" />
                        <div className="absolute top-[9%] bottom-[17%] left-[96%] w-[2px] bg-black" />
                        <div className="absolute top-[9%] bottom-[17%] left-[4%] w-[2px] bg-black" />

                        {/* Linhas horizontais */}
                        <div className="absolute top-[35%] left-[4%] right-[3.5%] h-[2px] bg-black" />
                        <div className="absolute top-[70%] left-[4%] right-[3.5%] h-[2px] bg-black" />
                        <div className="absolute top-[60%] left-[25%] right-[64%] h-[2px] bg-black" />
                        <div className="absolute top-[83%] left-[4%] right-[3.5%] h-[2px] bg-black" />
                        <div className="absolute top-[16.5%] left-[4%] right-[3.5%] h-[2px] bg-black" />
                        <div className="absolute top-[20%] left-[9%] right-[9.5%] h-[2px] bg-black" />
                        <div className="absolute top-[9%] left-[4%] right-[3.5%] h-[2px] bg-black" />

                        {/* Zonas clicáveis */}
                        {zonasBaliza.map((zona) => (
                          <button
                            key={zona.name}
                            onClick={() => atualizarZonaFora(index, zona.name)}
                            className="absolute hover:bg-blue-400 hover:opacity-80"
                            style={{
                              top: zona.top,
                              left: zona.left,
                              width: zona.width,
                              height: zona.height,
                            }}
                            title={zona.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => removerBolaParadaFora(index)}
                        className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => guardarBolaParadaFora(index)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ))}
                {bolasParadasForaGuardadas.length > 0 && (
                  <div className="mt-6 w-full">
                    <h4 className="font-semibold mb-2">Bolas Paradas Registadas</h4>
                    <ul className="space-y-1 text-sm">
                      {bolasParadasForaGuardadas.map((bola, i) => (
                        <li key={i} className="p-1 text-gray-700 flex justify-between items-center">
                          <span>
                            {equipaFora?.nome} – {bola.jogador}, {formatarResultado(bola.resultado, bola.resultadoRecarga)} {bola.tipo} na zona {bola.zona || "N/A"}
                          </span>
                          <button onClick={() => eliminarBolaParadaFora(i)} className="text-red-600 hover:text-red-800" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {/* Botões finais do modal */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={fecharModalBolasParadas}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Fechar
              </button>

              <button
                onClick={guardarTodasBolasParadas}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Guardar
              </button>

            </div>
          </div>
        </div>
      )}
      {/* Modal Nova Equipa */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{modoEdicao ? "Editar Equipa" : "Nova Equipa"}</h2>
            <input
              type="text"
              placeholder="Nome da Equipa"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mb-4"
            />
            {novoLogo && <img src={novoLogo} alt="Pré-visualização" className="h-20 mx-auto mb-4" />}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => { setMostrarModal(false); setModoEdicao(false); setNovoNome(""); setNovoLogo(null); setEquipaSelecionadaId(null); }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={salvarNovaEquipa}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analise2Divisao;
