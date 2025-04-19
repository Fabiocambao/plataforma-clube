import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CoordenadorHoquei = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [estatisticas, setEstatisticas] = useState<any[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaEstatistica, setNovaEstatistica] = useState({
    adversario: '',
    data: '',
    local: '',
    modalidade: 'Hóquei em Patins',
    escaloes: [],
    competicao: '',
  });

  const [escaloes, setEscaloes] = useState<string[]>([]);

  useEffect(() => {
    // Carregar estatísticas da localStorage ou de uma API
    const guardadas = JSON.parse(localStorage.getItem('estatisticas_hóquei') || '[]');
    setEstatisticas(guardadas);

    // Carregar escalões
    const escalas = ['Infantis', 'Juvenis', 'Juniores', 'Seniores']; // Exemplo
    setEscaloes(escalas);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redireciona para a página de login
  };

  const handleSaveEstatistica = () => {
    const novasEstatisticas = [...estatisticas, novaEstatistica];
    setEstatisticas(novasEstatisticas);
    localStorage.setItem('estatisticas_hóquei', JSON.stringify(novasEstatisticas));
    setModalAberto(false); // Fecha o modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Cabeçalho com informações do usuário */}
        <div className="flex justify-between items-center border-b pb-4">
          <img src="/logo_clube.png" alt="Logo" className="h-10" />
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700 font-medium">{user?.nome}</span>
            <img src={user?.foto || '/avatar.png'} alt="Foto" className="w-10 h-10 rounded-full object-cover border" />
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-xl" title="Terminar Sessão">⎋</button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Estatísticas de Hóquei</h1>
          <button onClick={() => setModalAberto(true)} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            + Nova Estatística
          </button>
        </div>

        {/* Exibição das estatísticas armazenadas */}
        <div className="bg-white p-4 rounded shadow">
          {estatisticas.length === 0 ? (
            <p className="text-gray-500">Ainda não existem estatísticas guardadas.</p>
          ) : (
            <ul className="space-y-2">
              {estatisticas.map((e, idx) => (
                <li key={idx} className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <strong>{e.modalidade} - {e.escaloes.join(", ")}</strong> vs <strong>{e.adversario}</strong> em {new Date(e.data).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal para adicionar nova estatística */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-6xl p-6 rounded-lg shadow space-y-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800">Nova Estatística</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Adversário"
                value={novaEstatistica.adversario}
                onChange={(e) => setNovaEstatistica({ ...novaEstatistica, adversario: e.target.value })}
                className="border p-2 rounded h-full"
              />
              <input
                type="date"
                value={novaEstatistica.data}
                onChange={(e) => setNovaEstatistica({ ...novaEstatistica, data: e.target.value })}
                className="border p-2 rounded h-full"
              />
              <select
                value={novaEstatistica.local}
                onChange={(e) => setNovaEstatistica({ ...novaEstatistica, local: e.target.value })}
                className="border p-2 rounded h-full"
                required
              >
                <option value="">Selecionar Local</option>
                <option value="Casa">Casa</option>
                <option value="Fora">Fora</option>
              </select>
              <select
                value={novaEstatistica.modalidade}
                onChange={(e) => setNovaEstatistica({ ...novaEstatistica, modalidade: e.target.value })}
                className="border p-2 rounded h-full"
              >
                <option value="Hóquei em Patins">Hóquei em Patins</option>
              </select>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownAberto((prev) => !prev)}
                  className="w-full border p-2 rounded flex justify-between items-center h-full"
                >
                  {novaEstatistica.escaloes.length > 0
                    ? novaEstatistica.escaloes.join(", ")
                    : "Selecionar Escalões"}
                  <span className="ml-2">▾</span>
                </button>

                {dropdownAberto && (
                  <div className="absolute bg-white border rounded shadow-lg mt-1 w-full z-10 max-h-60 overflow-y-auto">
                    {escaloes.map((esc) => (
                      <label key={esc} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={novaEstatistica.escaloes.includes(esc)}
                          onChange={() => {
                            const atualizados = novaEstatistica.escaloes.includes(esc)
                              ? novaEstatistica.escaloes.filter((e) => e !== esc)
                              : [...novaEstatistica.escaloes, esc];
                            setNovaEstatistica({ ...novaEstatistica, escaloes: atualizados });
                          }}
                        />
                        {esc}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right pt-4">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEstatistica}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Guardar Estatística
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordenadorHoquei;
