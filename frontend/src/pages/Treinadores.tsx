import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const Treinadores = () => {
  const [treinadores, setTreinadores] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const treinadores = storedUsers.filter(
      (user: any) =>
        user.perfil === "Treinador" &&
        user.modalidade &&
        user.escalão &&
        user.escalão.length > 0
    );

    const atletas = storedUsers.filter((user: any) => user.perfil === "Atleta");

    const treinadoresComAtletas = treinadores.map((treinador: any) => {
      const escaloesTreinador = Array.isArray(treinador.escalão)
        ? treinador.escalão
        : [treinador.escalão];

      const atletasDoTreinador = atletas.filter(
        (atleta: any) =>
          atleta.modalidade === treinador.modalidade &&
          escaloesTreinador.includes(atleta.escalão)
      );

      return {
        ...treinador,
        atletas: atletasDoTreinador.length,
      };
    });

    setTreinadores(treinadoresComAtletas);
  }, []);

  const treinadoresFiltrados = treinadores.filter(
    (treinador) =>
      treinador.nome.toLowerCase().includes(search.toLowerCase()) ||
      treinador.modalidade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Modalidades</h3>
          <p className="text-lg font-bold text-gray-800">
            {new Set(treinadoresFiltrados.map((t) => t.modalidade)).size}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Escalões</h3>
          <p className="text-lg font-bold text-gray-800">
            {treinadoresFiltrados.reduce(
              (acc, t) => acc + (Array.isArray(t.escalão) ? t.escalão.length : 1),
              0
            )}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Atletas</h3>
          <p className="text-lg font-bold text-gray-800">
            {treinadoresFiltrados.reduce((acc, t) => acc + (t.atletas || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Treinadores</h3>
          <p className="text-lg font-bold text-gray-800">{treinadoresFiltrados.length}</p>
        </div>
      </div>

      {/* Pesquisa */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por Treinador ou Modalidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Tabela de Treinadores */}
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Treinador</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Modalidade</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Escalões</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Atletas</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            {treinadoresFiltrados.map((treinador) => (
              <tr
                key={treinador.id}
                className="hover:bg-gray-100 transition duration-200 border-t border-gray-200"
              >
                <td className="px-6 py-2 text-sm text-gray-600 flex items-center">
                  <img
                    src={treinador.foto}
                    alt="foto"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <span>{treinador.nome}</span>
                </td>
                <td className="px-6 py-2 text-sm text-gray-600">{treinador.modalidade}</td>
                <td className="px-6 py-2 text-sm text-gray-600">
                  {Array.isArray(treinador.escalão)
                    ? treinador.escalão.join(", ")
                    : treinador.escalão}
                </td>
                <td className="px-6 py-2 text-sm text-gray-600">{treinador.atletas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Treinadores;
