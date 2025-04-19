import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

type Modalidade = {
  id: number;
  nome: string;
  escalões: string[];
  atletas: number;
};

const Modalidades = () => {
  const [modalidades, setModalidades] = useState<Modalidade[]>(() => {
    const stored = localStorage.getItem("modalidades");
    try {
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModalidade, setNewModalidade] = useState("");

  const [editModalidadeId, setEditModalidadeId] = useState<number | null>(null);
  const [editModalidadeNome, setEditModalidadeNome] = useState("");

  useEffect(() => {
    localStorage.setItem("modalidades", JSON.stringify(modalidades));
  }, [modalidades]);

  const removeModalidade = (id: number) => {
    const updated = modalidades.filter((m) => m.id !== id);
    setModalidades(updated);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewModalidade("");
  };

  const addModalidade = () => {
    if (newModalidade.trim() === "") return;

    const newId = modalidades.length + 1;
    const newModalidadeObj: Modalidade = {
      id: newId,
      nome: newModalidade,
      escalões: [],
      atletas: 0,
    };

    setModalidades([...modalidades, newModalidadeObj]);
    closeModal();
  };

  const openEditModal = (modalidade: Modalidade) => {
    setEditModalidadeId(modalidade.id);
    setEditModalidadeNome(modalidade.nome);
  };

  const saveEditModalidade = () => {
    if (editModalidadeId === null || editModalidadeNome.trim() === "") return;

    const updated = modalidades.map((m) =>
      m.id === editModalidadeId ? { ...m, nome: editModalidadeNome } : m
    );

    setModalidades(updated);
    setEditModalidadeId(null);
    setEditModalidadeNome("");
  };

  return (
    <div className="space-y-8">
      {/* Container para os cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {/* Total de Modalidades */}
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-semibold text-gray-700">Total de Modalidades</h3>
    <p className="text-lg font-bold text-gray-800">{modalidades.length}</p>
  </div>

  {/* Total de Escalões (via equipas) */}
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-semibold text-gray-700">Total de Escalões</h3>
    <p className="text-lg font-bold text-gray-800">
      {JSON.parse(localStorage.getItem("equipas") || "[]").reduce(
        (acc: number, equipa: any) => acc + equipa.escalões.length,
        0
      )}
    </p>
  </div>

  {/* Total de Atletas (via usuarios) */}
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-semibold text-gray-700">Total de Atletas</h3>
    <p className="text-lg font-bold text-gray-800">
      {
        JSON.parse(localStorage.getItem("usuarios") || "[]").filter(
          (u: any) => u.perfil === "Atleta"
        ).length
      }
    </p>
  </div>

  {/* Total de Treinadores (via usuarios) */}
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-semibold text-gray-700">Total de Treinadores</h3>
    <p className="text-lg font-bold text-gray-800">
      {
        JSON.parse(localStorage.getItem("usuarios") || "[]").filter(
          (u: any) => u.perfil === "Treinador"
        ).length
      }
    </p>
  </div>
</div>


      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex w-full gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar Modalidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-5/6 pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={openModal}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 w-1/6"
            >
              + Nova Modalidade
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Nova Modalidade</h2>
            <input
              type="text"
              value={newModalidade}
              onChange={(e) => setNewModalidade(e.target.value)}
              placeholder="Nome da Modalidade"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={addModalidade}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalidadeId !== null && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Editar Modalidade</h2>
            <input
              type="text"
              value={editModalidadeNome}
              onChange={(e) => setEditModalidadeNome(e.target.value)}
              placeholder="Novo nome da Modalidade"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setEditModalidadeId(null)}
                className="bg-gray-300 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={saveEditModalidade}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modalidades Cadastradas */}
<div className="bg-white rounded-2xl shadow p-6">
  <table className="min-w-full">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-2 text-left text-sm text-gray-600">Modalidade</th>
        <th className="px-6 py-2 text-left text-sm text-gray-600">Escalões</th>
        <th className="px-6 py-2 text-left text-sm text-gray-600">Atletas</th>
        <th className="px-6 py-2 text-left text-sm text-gray-600">Ações</th>
      </tr>
    </thead>
    <tbody className="bg-gray-50">
      {modalidades
        .filter((modalidade) =>
          modalidade.nome.toLowerCase().includes(search.toLowerCase())
        )
        .map((modalidade) => {
          // Obter escalões da modalidade
          const equipas = JSON.parse(localStorage.getItem("equipas") || "[]");
          const escaloesDaModalidade = equipas.find((e: any) => e.nome === modalidade.nome)?.escalões || [];

          // Obter usuários atletas dessa modalidade
          const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
          const atletasDaModalidade = usuarios.filter(
            (u: any) => u.perfil === "Atleta" && u.modalidade === modalidade.nome
          );

          return (
            <tr
              key={modalidade.id}
              className="hover:bg-gray-100 transition duration-200 border-t border-gray-200"
            >
              <td className="px-6 py-2 text-sm text-gray-600 flex items-center">
                {modalidade.nome}
              </td>
              <td className="px-6 py-2 text-sm text-gray-600">{escaloesDaModalidade.length}</td>
              <td className="px-6 py-2 text-sm text-gray-600">{atletasDaModalidade.length}</td>
              <td className="px-6 py-2 text-sm text-gray-600 flex gap-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <FaEdit />
                </button>
                <button
                  onClick={() => removeModalidade(modalidade.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          );
        })}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Modalidades;
