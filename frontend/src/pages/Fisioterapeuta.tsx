import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";




const Fisioterapeuta = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [historicoLesoes, setHistoricoLesoes] = useState<any[]>([]);
  const [modalVerTudo, setModalVerTudo] = useState(false);
  const [modalNovaLesao, setModalNovaLesao] = useState(false);
  const [modalDetalhesLesao, setModalDetalhesLesao] = useState(false);
  const [novaLesao, setNovaLesao] = useState({
    atleta: '',
    data: '',
    tipo: '',
    local: '',
    gravidade: '',
    recuperacao: '',
    recuperacaoCompleta: '',
    observacoes: ''
  });
  


  const [modalidadeSelecionada, setModalidadeSelecionada] = useState('');
  const [escalaoSelecionado, setEscalaoSelecionado] = useState('');
  const [atletaSelecionado, setAtletaSelecionado] = useState('');
  const [atletasDisponiveis, setAtletasDisponiveis] = useState<any[]>([]);
  const [mostrarModalDataRecuperacao, setMostrarModalDataRecuperacao] = useState(false);
  const [indiceSelecionado, setIndiceSelecionado] = useState<number | null>(null);
  const [modalEditarLesao, setModalEditarLesao] = useState(false);
  const [lesaoEditando, setLesaoEditando] = useState<any | null>(null);
  const [indiceEdicao, setIndiceEdicao] = useState<number | null>(null);
  const [lesaoSelecionadaParaRecuperacao, setLesaoSelecionadaParaRecuperacao] = useState<any | null>(null);
  const [modalRecuperacaoCompleta, setModalRecuperacaoCompleta] = useState(false);
  const [consultas, setConsultas] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('consultas') || '[]');
  });
  
  




  const modalidades = JSON.parse(localStorage.getItem('modalidades') || '[]');
  const equipas = JSON.parse(localStorage.getItem('equipas') || '[]');
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

  useEffect(() => {
    const historico = JSON.parse(localStorage.getItem('historico_lesoes') || '[]');
  
    const ordenado = historico.sort((a: any, b: any) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });
  
    setHistoricoLesoes(ordenado);
  }, []);
  

  useEffect(() => {
    if (modalidadeSelecionada && escalaoSelecionado) {
      const atletasFiltrados = usuarios.filter((u: any) =>
        u.perfil.includes('Atleta') &&
        u.modalidade === modalidadeSelecionada &&
        (u.escalão === escalaoSelecionado || u.escalão?.atleta === escalaoSelecionado)
      );
      setAtletasDisponiveis(atletasFiltrados);
    }
  }, [modalidadeSelecionada, escalaoSelecionado]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <img src="/logo_clube.png" alt="Logo" className="h-10" />
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700 font-medium">{user?.nome}</span>
            <img src={user?.foto || '/avatar.png'} alt="Foto" className="w-10 h-10 rounded-full object-cover border" />
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-xl" title="Terminar Sessão">⎋</button>
          </div>
        </div>

        <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
  Bem-vindo, <span className="text-gray-800">{user?.nome}</span>!
</h1>

          <p className="text-lg text-gray-500">Aqui você pode gerenciar o histórico de lesões dos atletas.</p>

          {/* Mini Calendário de Consultas */}
<div className="bg-white shadow rounded p-4 my-6">
  <h3 className="text-md font-semibold text-gray-700 mb-3">Próximas Consultas (7 dias)</h3>
  <div className="grid grid-cols-7 gap-2 text-center text-sm">
    {[...Array(7)].map((_, i) => {
      const hoje = new Date();
      const dia = new Date();
      dia.setDate(hoje.getDate() + i);
      const dataFormatada = dia.toISOString().split("T")[0];

      const consultasDoDia = consultas.filter(
        (c) => c.data?.split("T")[0] === dataFormatada
      );
      

      

      return (
        <div
          key={i}
          className="border rounded p-2 bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="font-semibold text-gray-700">
            {dia.toLocaleDateString("pt-PT", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
            })}
          </div>
          {consultasDoDia.length > 0 ? (
            consultasDoDia.map((c, idx) => (
              <div key={idx} className="text-xs text-gray-600 mt-1">
                {c.atleta}<br />
                {new Date(c.data).toLocaleTimeString("pt-PT", {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 italic mt-1">—</div>
          )}
        </div>
      );
    })}
  </div>
</div>

<div className="text-right">
  <button
    onClick={() => navigate('/agendaFisio')}
    className="text-red-400 hover:underline text-sm font-medium"
  >
    Aceder à agenda completa →
  </button>
</div>


        </div>

        <div className="bg-white p-4 rounded shadow">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-gray-800">Últimos Registos de Lesões</h2>
    <button
      onClick={() => {
        setModalNovaLesao(true);
        setModalDetalhesLesao(false);
        setNovaLesao({
          atleta: '',
          data: '',
          tipo: '',
          local: '',
          gravidade: '',
          recuperacao: '',
          recuperacaoCompleta: '',
          observacoes: ''
        });
      }}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      + Nova Lesão
    </button>
  </div>

  

  {historicoLesoes.length === 0 ? (
    <p className="text-gray-500">Ainda não existem lesões registradas.</p>
  ) : (
    <table className="min-w-full text-sm text-gray-700">
  <thead>
    <tr className="bg-gray-100">
      <th className="py-2 px-4 text-left">Atleta</th>
      <th className="py-2 px-4 text-left">Descrição</th>
      <th className="py-2 px-4 text-left">Gravidade</th>
      <th className="py-2 px-4 text-left">Data Início de Lesão</th>
      <th className="py-2 px-4 text-left">Data Previsão de Recuperação</th>
      <th className="py-2 px-4 text-left">Data Recuperação Completa</th>
      <th className="py-2 px-4 text-left">Ações</th>
    </tr>
  </thead>

  <tbody>
    {[...historicoLesoes]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5)
      .map((lesao, idx) => (
        <tr
          key={idx}
          className="border-t"
          title={`Observações: ${lesao.observacoes || "Nenhuma"}`}
        >
          <td className="py-2 px-4">{lesao.atleta}</td>
          <td className="py-2 px-4">{lesao.descricao}</td>
          <td className="py-2 px-4">{lesao.gravidade || '—'}</td>

          {/* ✅ Data Início da Lesão */}
          <td className="py-2 px-4">
            {lesao.data ? new Date(lesao.data).toLocaleDateString() : '—'}
          </td>

          {/* ✅ Data Previsão de Recuperação */}
          <td className="py-2 px-4">
            {lesao.recuperacao ? new Date(lesao.recuperacao).toLocaleDateString() : '—'}
          </td>

          {/* ✅ Data Recuperação Completa */}
          <td className="py-2 px-4">
  {lesao.recuperacaoCompleta ? (
    new Date(lesao.recuperacaoCompleta).toLocaleDateString()
  ) : (
    <div className="flex items-center gap-2 text-yellow-600">
      <span>em recuperação</span>
      <button
        onClick={() => {
          setLesaoSelecionadaParaRecuperacao(lesao);
          setModalRecuperacaoCompleta(true);
        }}
        className="hover:text-blue-600"
        title="Definir data de recuperação"
      >
        <FaCalendarAlt />
      </button>
    </div>
  )}
</td>


          {/* Ações */}
          <td className="py-2 px-4 flex gap-2 items-center">
          <button
  className="text-gray-400 hover:text-blue-800"
  title="Editar"
  onClick={() => {
    setLesaoEditando(lesao);
    setModalEditarLesao(true);
  }}
>
  <FaEdit />
</button>

            <button
              className="text-gray-400 hover:text-red-800"
              title="Eliminar"
              onClick={() => {
                const novaLista = historicoLesoes.filter(
                  (item, i) =>
                    i !== historicoLesoes.findIndex(
                      (el) =>
                        el.atleta === lesao.atleta &&
                        el.data === lesao.data &&
                        el.descricao === lesao.descricao
                    )
                );
                setHistoricoLesoes(novaLista);
                localStorage.setItem("historico_lesoes", JSON.stringify(novaLista));
              }}
            >
              <FaTrashAlt />
            </button>
          </td>
        </tr>
      ))}
  </tbody>
</table>

          )}
        </div>

        {historicoLesoes.length > 3 && (
  <div className="text-right mt-2">
    <button
      onClick={() => setModalVerTudo(true)}
      className="text-red-600 text-sm hover:underline"
    >
      Ver todos os registos de lesões
    </button>
  </div>
)}


        {modalVerTudo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
              <h2 className="text-xl font-bold mb-4">Todos os Registros de Lesões</h2>
              <div className="overflow-auto max-h-96">
                <table className="min-w-full text-sm text-gray-700">
                <thead>
  <tr className="bg-gray-100">
    <th className="py-2 px-4 text-left">Atleta</th>
    <th className="py-2 px-4 text-left">Descrição</th>
    <th className="py-2 px-4 text-left">Gravidade</th>
    <th className="py-2 px-4 text-left">Data Início de Lesão</th>
    <th className="py-2 px-4 text-left">Previsão Recuperação</th>
    <th className="py-2 px-4 text-left">Recuperação Completa</th>
  </tr>
</thead>
<tbody>
  {[...historicoLesoes]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .map((lesao, idx) => (
      <tr key={idx} className="border-t">
        <td className="py-2 px-4">{lesao.atleta}</td>
        <td className="py-2 px-4">{lesao.descricao}</td>
        <td className="py-2 px-4">{lesao.gravidade || '—'}</td>
        <td className="py-2 px-4">{lesao.data ? new Date(lesao.data).toLocaleDateString() : '—'}</td>
        <td className="py-2 px-4">{lesao.recuperacao ? new Date(lesao.recuperacao).toLocaleDateString() : '—'}</td>
        <td className="py-2 px-4">{lesao.recuperacaoCompleta ? new Date(lesao.recuperacaoCompleta).toLocaleDateString() : '—'}</td>
      </tr>
    ))}
</tbody>



                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setModalVerTudo(false)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Fechar</button>
              </div>
            </div>
          </div>
        )}

{modalNovaLesao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl">
              <h2 className="text-xl font-bold mb-4">Nova Lesão - Selecionar Atleta</h2>
              <select value={modalidadeSelecionada} onChange={(e) => { setModalidadeSelecionada(e.target.value); setEscalaoSelecionado(''); setAtletaSelecionado(''); }} className="w-full border rounded p-2 mb-4">
                <option value="">Selecione a Modalidade</option>
                {modalidades.map((mod: any) => (<option key={mod.nome} value={mod.nome}>{mod.nome}</option>))}
              </select>
              <select value={escalaoSelecionado} onChange={(e) => { setEscalaoSelecionado(e.target.value); setAtletaSelecionado(''); }} className="w-full border rounded p-2 mb-4" disabled={!modalidadeSelecionada}>
                <option value="">Selecione o Escalão</option>
                {equipas.filter((e: any) => e.nome === modalidadeSelecionada).flatMap((e: any) => e.escalões).map((esc: any) => (<option key={esc.nome} value={esc.nome}>{esc.nome}</option>))}
              </select>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {atletasDisponiveis.map((a) => (
    <div
      key={a.id}
      onClick={() => setAtletaSelecionado(a.nome)}
      className={`cursor-pointer border rounded p-4 text-center transition
        ${atletaSelecionado === a.nome ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
      `}
    >
      <img
        src={a.foto || "/avatar.png"}
        alt={a.nome}
        className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
      />
      <p className="text-sm font-medium text-gray-700">{a.nome}</p>
    </div>
  ))}
</div>

              

              <div className="flex justify-end gap-2">
              <button
  onClick={() => {
    setModalNovaLesao(false);
    setModalidadeSelecionada('');
    setEscalaoSelecionado('');
    setAtletaSelecionado('');
    setAtletasDisponiveis([]); // limpa lista de atletas
    setNovaLesao({
      atleta: '',
      data: '',
      tipo: '',
      local: '',
      gravidade: '',
      recuperacao: '',
      recuperacaoCompleta: '',
      observacoes: ''
    });
  }}
  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
>
  Cancelar
</button>

<button
  disabled={!atletaSelecionado}
  onClick={() => {
    setNovaLesao((prev) => ({
      ...prev,
      atleta: atletaSelecionado,
      data: '',
      tipo: '',
      local: '',
      gravidade: '',
      recuperacao: '',
      recuperacaoCompleta: '',
      observacoes: ''
    }));
    setModalNovaLesao(false);
    setModalDetalhesLesao(true);
    setModalidadeSelecionada('');
    setEscalaoSelecionado('');
    setAtletaSelecionado('');
    setAtletasDisponiveis([]); // limpa lista de atletas aqui também
  }}
  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
>
  Continuar
</button>


              </div>
            </div>
          </div>
        )}

{modalDetalhesLesao && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl">

      <h2 className="text-xl font-bold mb-4">Detalhes da Lesão</h2>

      <p className="mb-4 text-sm text-gray-700">
        <strong>Atleta Selecionado:</strong> {novaLesao.atleta}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Data de Início de Lesão */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Data de Início de Lesão</label>
    <input
      type="date"
      value={novaLesao.data}
      onChange={(e) => setNovaLesao({ ...novaLesao, data: e.target.value })}
      className={`w-full border rounded p-2 ${
        novaLesao.data ? 'text-gray-900' : 'text-gray-400'
      }`}
    />
  </div>

  {/* Tipo de Lesão */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Tipo de Lesão</label>
    <input
      type="text"
      value={novaLesao.tipo}
      onChange={(e) => setNovaLesao({ ...novaLesao, tipo: e.target.value })}
      className="w-full border rounded p-2"
      placeholder="Inserir tipo de lesão..."
    />
  </div>

  {/* Local da Lesão */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Local da Lesão</label>
    <input
      type="text"
      value={novaLesao.local}
      onChange={(e) => setNovaLesao({ ...novaLesao, local: e.target.value })}
      className="w-full border rounded p-2"
      placeholder="Inserir local da lesão..."
    />
  </div>

  {/* Gravidade da Lesão */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Gravidade da Lesão</label>
    <select
      value={novaLesao.gravidade}
      onChange={(e) => setNovaLesao({ ...novaLesao, gravidade: e.target.value })}
      className={`w-full border rounded p-2 ${
        novaLesao.gravidade ? 'text-gray-900' : 'text-gray-400'
      }`}
    >
      <option value="" disabled hidden>Escolher gravidade da lesão...</option>
      <option className="text-gray-900" value="Leve">Leve</option>
      <option className="text-yellow-600" value="Moderada">Moderada</option>
      <option className="text-red-600" value="Grave">Grave</option>
    </select>
  </div>

  {/* Previsão de Recuperação */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Data Prevista de Recuperação</label>
    <input
      type="date"
      value={novaLesao.recuperacao}
      onChange={(e) => setNovaLesao({ ...novaLesao, recuperacao: e.target.value })}
      className={`w-full border rounded p-2 ${
        novaLesao.recuperacao ? 'text-gray-900' : 'text-gray-400'
      }`}
    />
  </div>

  {/* Observações adicionais */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Observações adicionais</label>
    <textarea
      value={novaLesao.observacoes}
      onChange={(e) => setNovaLesao({ ...novaLesao, observacoes: e.target.value })}
      className="w-full border rounded p-2"
      placeholder="Inserir observações adicionais..."
      rows={3}
    />
  </div>
</div>


      {/* Botões */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setModalDetalhesLesao(false)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          disabled={!novaLesao.data || !novaLesao.tipo || !novaLesao.local}
          onClick={() => {
            const nova = {
              atleta: novaLesao.atleta,
              data: novaLesao.data,
              descricao: `${novaLesao.tipo} (${novaLesao.local})`,
              gravidade: novaLesao.gravidade,
              recuperacao: novaLesao.recuperacao,
              recuperacaoCompleta: novaLesao.recuperacaoCompleta,
              observacoes: novaLesao.observacoes
            };

            const atualizados = [...historicoLesoes, nova].sort(
              (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
            );

            setHistoricoLesoes(atualizados);
            localStorage.setItem('historico_lesoes', JSON.stringify(atualizados));

            setNovaLesao({
              atleta: '',
              data: '',
              tipo: '',
              local: '',
              gravidade: '',
              recuperacao: '',
              recuperacaoCompleta: '',
              observacoes: ''
            });

            setModalDetalhesLesao(false);
          }}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
)}


      </div>

      {mostrarModalDataRecuperacao && indiceSelecionado !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
      <h3 className="text-lg font-bold mb-4">Data de Recuperação Completa</h3>
      <input
        type="date"
        className="w-full border rounded p-2 mb-4"
        onChange={(e) => {
          const novaData = e.target.value;
          const atualizado = historicoLesoes.map((item, i) =>
            i === indiceSelecionado ? { ...item, recuperacaoCompleta: novaData } : item
          );
          setHistoricoLesoes(atualizado);
          localStorage.setItem("historico_lesoes", JSON.stringify(atualizado));
          setMostrarModalDataRecuperacao(false);
          setIndiceSelecionado(null);
        }}
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setMostrarModalDataRecuperacao(false);
            setIndiceSelecionado(null);
          }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{modalEditarLesao && lesaoEditando && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">Editar Lesão - {lesaoEditando.atleta}</h2>

      <label className="block mb-1 text-sm font-medium text-gray-700">Descrição</label>
      <input
        type="text"
        value={lesaoEditando.descricao}
        onChange={(e) => setLesaoEditando({ ...lesaoEditando, descricao: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="block mb-1 text-sm font-medium text-gray-700">Gravidade</label>
      <select
        value={lesaoEditando.gravidade}
        onChange={(e) => setLesaoEditando({ ...lesaoEditando, gravidade: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="Leve">Leve</option>
        <option value="Moderada">Moderada</option>
        <option value="Grave">Grave</option>
      </select>

      <label className="block mb-1 text-sm font-medium text-gray-700">Data Início de Lesão</label>
      <input
        type="date"
        value={lesaoEditando.data}
        onChange={(e) => setLesaoEditando({ ...lesaoEditando, data: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="block mb-1 text-sm font-medium text-gray-700">Data Previsão de Recuperação</label>
      <input
        type="date"
        value={lesaoEditando.recuperacao}
        onChange={(e) => setLesaoEditando({ ...lesaoEditando, recuperacao: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="block mb-1 text-sm font-medium text-gray-700">Data Recuperação Completa</label>
      <input
        type="date"
        value={lesaoEditando.recuperacaoCompleta || ''}
        onChange={(e) => setLesaoEditando({ ...lesaoEditando, recuperacaoCompleta: e.target.value })}
        className="w-full border rounded p-2 mb-4"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setModalEditarLesao(false)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            const atualizados = historicoLesoes.map((lesao) =>
              lesao.atleta === lesaoEditando.atleta &&
              lesao.data === lesaoEditando.data &&
              lesao.descricao === lesaoEditando.descricao
                ? lesaoEditando
                : lesao
            );

            setHistoricoLesoes(atualizados);
            localStorage.setItem("historico_lesoes", JSON.stringify(atualizados));
            setModalEditarLesao(false);
          }}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
)}

{modalRecuperacaoCompleta && lesaoSelecionadaParaRecuperacao && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-sm">
      <h2 className="text-xl font-bold mb-4">Definir Data de Recuperação Completa</h2>

      <input
        type="date"
        className="w-full border rounded p-2 mb-4"
        onChange={(e) => {
          const dataRecuperacao = e.target.value;
          const atualizado = historicoLesoes.map((l) =>
            l === lesaoSelecionadaParaRecuperacao
              ? { ...l, recuperacaoCompleta: dataRecuperacao }
              : l
          );
          setHistoricoLesoes(atualizado);
          localStorage.setItem("historico_lesoes", JSON.stringify(atualizado));
          setModalRecuperacaoCompleta(false);
        }}
      />

      <div className="flex justify-end">
        <button
          onClick={() => setModalRecuperacaoCompleta(false)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Fisioterapeuta;