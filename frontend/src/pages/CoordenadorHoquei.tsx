import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUsers, FaHeartbeat, FaChartBar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const CoordenadorHoquei = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const storedConsultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    const storedEventos = JSON.parse(localStorage.getItem('events') || '[]');

    setUsuarios(storedUsers);
    setConsultas(storedConsultas);
    setEventos(storedEventos);
  }, []);

  const atletas = usuarios.filter(u => u.perfil === 'Atleta' && u.modalidade === 'Hóquei em Patins');
  const treinadores = usuarios.filter(u => u.perfil === 'Treinador' && u.modalidade === 'Hóquei em Patins');
  const escalões = Array.from(new Set(atletas.map(a => a.escalão)));
  const consultasHoquei = consultas.filter(c => atletas.some(a => a.nome === c.atleta));
  const eventosHoquei = eventos.filter(e => escalões.includes(e.escalao));

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Coordenador - Hóquei em Patins</h1>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaUsers className="text-3xl text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Atletas</p>
            <p className="text-xl font-semibold">{atletas.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaUsers className="text-3xl text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Treinadores</p>
            <p className="text-xl font-semibold">{treinadores.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaChartBar className="text-3xl text-yellow-600" />
          <div>
            <p className="text-gray-500 text-sm">Escalões</p>
            <p className="text-xl font-semibold">{escalões.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
          <FaHeartbeat className="text-3xl text-red-600" />
          <div>
            <p className="text-gray-500 text-sm">Consultas</p>
            <p className="text-xl font-semibold">{consultasHoquei.length}</p>
          </div>
        </div>
      </div>

      {/* AGENDA + DETALHES FUTUROS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Agenda de Eventos - Todos os Escalões</h2>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {eventosHoquei.map((e, idx) => (
            <li key={idx} className="border p-3 rounded text-sm">
              <strong>{e.tipoEvento}</strong> - {e.escalao} <br />
              <span className="text-gray-500">
                {new Date(e.start).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </li>
          ))}
          {eventosHoquei.length === 0 && (
            <p className="text-gray-400 italic">Nenhum evento registado.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CoordenadorHoquei;
