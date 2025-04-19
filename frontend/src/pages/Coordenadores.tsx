import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const Coordenadores = () => {
  const [coordenadores, setCoordenadores] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const coordenadores = storedUsers.filter(
      (user: any) =>
        user.perfil?.includes("Coordenador") &&
        user.modalidade
    );

    const atletas = storedUsers.filter((user: any) => user.perfil?.includes("Atleta"));

    const coordenadoresComAtletas = coordenadores.map((coord: any) => {
      const escaloesCoord = Array.isArray(coord.escalão)
        ? coord.escalão
        : [coord.escalão];

      const atletasDoCoord = atletas.filter(
        (atleta: any) =>
          atleta.modalidade === coord.modalidade &&
          escaloesCoord.includes(atleta.escalão)
      );

      return {
        ...coord,
        atletas: atletasDoCoord.length,
      };
    });

    setCoordenadores(coordenadoresComAtletas);
  }, []);

  const coordenadoresFiltrados = coordenadores.filter(
    (coord) =>
      coord.nome.toLowerCase().includes(search.toLowerCase()) ||
      coord.modalidade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Modalidades</h3>
          <p className="text-lg font-bold text-gray-800">
            {new Set(coordenadoresFiltrados.map((c) => c.modalidade)).size}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Escalões</h3>
          <p className="text-lg font-bold text-gray-800">
            {coordenadoresFiltrados.reduce(
              (acc, c) => acc + (Array.isArray(c.escalão) ? c.escalão.length : 1),
              0
            )}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Atletas</h3>
          <p className="text-lg font-bold text-gray-800">
            {coordenadoresFiltrados.reduce((acc, c) => acc + (c.atletas || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Coordenadores</h3>
          <p className="text-lg font-bold text-gray-800">{coordenadoresFiltrados.length}</p>
        </div>
      </div>

      {/* Pesquisa */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por Coordenador ou Modalidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Tabela */}
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Coordenador</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Modalidade</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Escalões</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Atletas</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            {coordenadoresFiltrados.map((coord) => (
              <tr
                key={coord.id}
                className="hover:bg-gray-100 transition duration-200 border-t border-gray-200"
              >
                <td className="px-6 py-2 text-sm text-gray-600 flex items-center">
                  <img
                    src={coord.foto}
                    alt="foto"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <span>{coord.nome}</span>
                </td>
                <td className="px-6 py-2 text-sm text-gray-600">{coord.modalidade}</td>
                <td className="px-6 py-2 text-sm text-gray-600">
                  {Array.isArray(coord.escalão)
                    ? coord.escalão.join(", ")
                    : coord.escalão}
                </td>
                <td className="px-6 py-2 text-sm text-gray-600">{coord.atletas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coordenadores;
