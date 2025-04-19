import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Fisioterapeuta = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [historicoLesoes, setHistoricoLesoes] = useState<any[]>([]);

  useEffect(() => {
    // Carregar histórico de lesões ou dados relacionados ao fisioterapeuta (exemplo com localStorage)
    const historico = JSON.parse(localStorage.getItem('historico_lesoes') || '[]');
    setHistoricoLesoes(historico);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redireciona para a página de login
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

        {/* Título da Página */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Bem-vindo, Fisioterapeuta!</h1>
          <p className="text-lg text-gray-500">Aqui você pode gerenciar o histórico de lesões dos atletas.</p>
        </div>

        {/* Seção de Histórico de Lesões */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Lesões</h2>

          {historicoLesoes.length === 0 ? (
            <p className="text-gray-500">Ainda não existem lesões registradas.</p>
          ) : (
            <ul className="space-y-2">
              {historicoLesoes.map((lesao, idx) => (
                <li key={idx} className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <strong>Atleta: {lesao.atleta}</strong> - {lesao.descricao} - {new Date(lesao.data).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ações */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/historico-lesoes")}
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Adicionar Histórico de Lesão
          </button>
          <button
            onClick={() => navigate("/consultar-lesao")}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Consultar Lesões
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fisioterapeuta;
