import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Competicoes = () => {
  const [competicoes, setCompeticoes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [novaCompeticao, setNovaCompeticao] = useState({
    nome: "",
    modalidade: "",
    escalao: "",
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [competicaoEditandoId, setCompeticaoEditandoId] = useState<number | null>(null);

  const modalidades = JSON.parse(localStorage.getItem("modalidades") || "[]");
  const equipas = JSON.parse(localStorage.getItem("equipas") || "[]");

  useEffect(() => {
    const stored = localStorage.getItem("competicoes");
    if (stored) {
      setCompeticoes(JSON.parse(stored));
    }
  }, []);

  const escaloesDisponiveis =
    equipas.find((e: any) => e.nome === novaCompeticao.modalidade)?.escalões.map((e: any) => e.nome) || [];

  const handleAbrirModal = () => {
    setIsModalOpen(true);
    setModoEdicao(false);
    setCompeticaoEditandoId(null);
    setNovaCompeticao({ nome: "", modalidade: "", escalao: "" });
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setModoEdicao(false);
    setCompeticaoEditandoId(null);
    setNovaCompeticao({ nome: "", modalidade: "", escalao: "" });
  };

  const handleSalvarCompeticao = () => {
    const atualizadas = [...competicoes];

    if (modoEdicao && competicaoEditandoId !== null) {
      const index = atualizadas.findIndex((c) => c.id === competicaoEditandoId);
      if (index !== -1) {
        atualizadas[index] = {
          ...atualizadas[index],
          ...novaCompeticao,
        };
      }
    } else {
      atualizadas.push({
        ...novaCompeticao,
        id: Date.now(),
        tipo: "Oficial",
      });
    }

    setCompeticoes(atualizadas);
    localStorage.setItem("competicoes", JSON.stringify(atualizadas));
    fecharModal();
  };

  const handleEditarCompeticao = (comp: any) => {
    setModoEdicao(true);
    setCompeticaoEditandoId(comp.id);
    setNovaCompeticao({
      nome: comp.nome,
      modalidade: comp.modalidade,
      escalao: comp.escalao,
    });
    setIsModalOpen(true);
  };

  const handleRemoverCompeticao = (id: number) => {
    const confirm = window.confirm("Tem a certeza que deseja remover esta competição?");
    if (!confirm) return;

    const atualizadas = competicoes.filter((c) => c.id !== id);
    setCompeticoes(atualizadas);
    localStorage.setItem("competicoes", JSON.stringify(atualizadas));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          onClick={handleAbrirModal}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          + Nova Competição
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Lista de Competições</h2>

        {competicoes.length === 0 ? (
          <p className="text-gray-500">Nenhuma competição registada.</p>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Modalidade</th>
                <th className="px-4 py-2">Escalão</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              {competicoes.map((comp) => (
                <tr key={comp.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{comp.nome}</td>
                  <td className="px-4 py-2">{comp.modalidade}</td>
                  <td className="px-4 py-2">{comp.escalao}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
    onClick={() => handleEditarCompeticao(comp)}
    className="text-gray-400 hover:text-blue-800"
    title="Editar"
  >
    <FaEdit />
  </button>
  <button
    onClick={() => handleRemoverCompeticao(comp.id)}
    className="text-gray-400 hover:text-red-800"
    title="Remover"
  >
    <FaTrash />
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              {modoEdicao ? "Editar Competição" : "Nova Competição"}
            </h3>

            <input
              type="text"
              placeholder="Nome da Competição"
              value={novaCompeticao.nome}
              onChange={(e) => setNovaCompeticao({ ...novaCompeticao, nome: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <select
              value={novaCompeticao.modalidade}
              onChange={(e) =>
                setNovaCompeticao({
                  ...novaCompeticao,
                  modalidade: e.target.value,
                  escalao: "",
                })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Selecionar Modalidade</option>
              {modalidades.map((mod: any) => (
                <option key={mod.id} value={mod.nome}>
                  {mod.nome}
                </option>
              ))}
            </select>

            <select
              value={novaCompeticao.escalao}
              onChange={(e) => setNovaCompeticao({ ...novaCompeticao, escalao: e.target.value })}
              className="border p-2 rounded w-full"
              disabled={!novaCompeticao.modalidade}
            >
              <option value="">Selecionar Escalão</option>
              {escaloesDisponiveis.map((escalao: string) => (
                <option key={escalao} value={escalao}>
                  {escalao}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={fecharModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarCompeticao}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {modoEdicao ? "Guardar Alterações" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Competicoes;
