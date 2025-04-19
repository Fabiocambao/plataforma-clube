import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const Fisioterapia = () => {
  const [fisioterapeutas, setFisioterapeutas] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const fisioterapeutas = storedUsers.filter((user: any) =>
      user.perfil?.includes("Fisioterapeuta")
    );

    setFisioterapeutas(fisioterapeutas);
  }, []);

  const filtrados = fisioterapeutas.filter(
    (fisio) =>
      fisio.nome.toLowerCase().includes(search.toLowerCase()) ||
      fisio.modalidade?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Total de Fisioterapeutas</h3>
          <p className="text-lg font-bold text-gray-800">{filtrados.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-gray-700">Modalidades Abrangidas</h3>
          <p className="text-lg font-bold text-gray-800">
            {new Set(filtrados.map((f) => f.modalidade)).size}
          </p>
        </div>
      </div>

      {/* Pesquisa */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por nome ou modalidade..."
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
              <th className="px-6 py-2 text-left text-sm text-gray-600">Nome</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Modalidade</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            {filtrados.map((fisio) => (
              <tr
                key={fisio.id}
                className="hover:bg-gray-100 transition duration-200 border-t border-gray-200"
              >
                <td className="px-6 py-2 text-sm text-gray-600 flex items-center">
                  <img
                    src={fisio.foto}
                    alt="foto"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <span>{fisio.nome}</span>
                </td>
                <td className="px-6 py-2 text-sm text-gray-600">{fisio.modalidade || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fisioterapia;
