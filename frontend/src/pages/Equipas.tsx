import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";

type Escalão = {
  nome: string;
  treinadores: string;
  atletas: number;
};

type Modalidade = {
  id: number;
  nome: string;
  escalões: Escalão[];
};

const Equipas = () => {
  const [equipas, setEquipas] = useState<Modalidade[]>(() => {
    const stored = localStorage.getItem("equipas");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {
        console.error("Erro ao ler equipas do localStorage:", err);
      }
    }
    return [];
  });

  const [usuarios, setUsuarios] = useState<any[]>([]);

useEffect(() => {
  const storedUsuarios = localStorage.getItem("usuarios");
  if (storedUsuarios) {
    try {
      setUsuarios(JSON.parse(storedUsuarios));
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  }
}, []);


  const [selectedModalidade, setSelectedModalidade] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isAddEscalaoModalOpen, setIsAddEscalaoModalOpen] = useState(false);
  const [novoEscalaoNome, setNovoEscalaoNome] = useState("");
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("");
  const [modalidadesDisponiveis, setModalidadesDisponiveis] = useState<string[]>([]);

  const [isEditEscalaoModalOpen, setIsEditEscalaoModalOpen] = useState(false);
  const [escalaoEditando, setEscalaoEditando] = useState<Escalão | null>(null);
  const [modalidadeOriginal, setModalidadeOriginal] = useState<string>("");
  const [modalidadeNova, setModalidadeNova] = useState("");

  useEffect(() => {
    localStorage.setItem("equipas", JSON.stringify(equipas));
  }, [equipas]);

  useEffect(() => {
    const stored = localStorage.getItem("modalidades");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const nomes = parsed.map((m: { nome: string }) => m.nome);
        setModalidadesDisponiveis(nomes);
      } catch (err) {
        console.error("Erro ao carregar modalidades:", err);
      }
    }
  }, []);

  const adicionarNovoEscalao = () => {
    if (!novoEscalaoNome || !modalidadeSelecionada) return;

    setEquipas((prevEquipas) => {
      const index = prevEquipas.findIndex((e) => e.nome === modalidadeSelecionada);
      const novoEscalao: Escalão = {
        nome: novoEscalaoNome,
        treinadores: "",
        atletas: 0,
      };

      if (index !== -1) {
        const atualizada = [...prevEquipas];
        const escalaoExiste = atualizada[index].escalões.some(
          (e) => e.nome.toLowerCase() === novoEscalao.nome.toLowerCase()
        );
      
        if (!escalaoExiste) {
          atualizada[index].escalões.push(novoEscalao);
        }
      
        return atualizada;
      }      

      return [
        ...prevEquipas,
        {
          id: Date.now(),
          nome: modalidadeSelecionada,
          escalões: [novoEscalao],
        },
      ];
    });

    setNovoEscalaoNome("");
    setModalidadeSelecionada("");
    setIsAddEscalaoModalOpen(false);
  };

  const abrirModalEditarEscalao = (escalao: Escalão, modalidade: string) => {
    setEscalaoEditando({ ...escalao });
    setModalidadeOriginal(modalidade);
    setModalidadeNova(modalidade);
    setIsEditEscalaoModalOpen(true);
  };

  const salvarEdicaoEscalao = () => {
    if (!escalaoEditando) return;

    setEquipas((prev) => {
      const novaLista = [...prev];

      const modOriginal = novaLista.find((m) => m.nome === modalidadeOriginal);
      if (modOriginal) {
        modOriginal.escalões = modOriginal.escalões.filter((e) => e.nome !== escalaoEditando.nome);
      }

      const modDestino = novaLista.find((m) => m.nome === modalidadeNova);
      if (modDestino) {
        modDestino.escalões.push(escalaoEditando);
      } else {
        novaLista.push({
          id: Date.now(),
          nome: modalidadeNova,
          escalões: [escalaoEditando],
        });
      }

      return novaLista.filter((m) => m.escalões.length > 0);
    });

    setIsEditEscalaoModalOpen(false);
    setEscalaoEditando(null);
    setModalidadeOriginal("");
    setModalidadeNova("");
  };

  const removerEscalao = (modalidadeNome: string, escalaoNome: string) => {
    setEquipas((prev) => {
      return prev
        .map((modalidade) => {
          if (modalidade.nome === modalidadeNome) {
            const escaloesAtualizados = modalidade.escalões.filter(
              (escalao) => escalao.nome !== escalaoNome
            );
            return {
              ...modalidade,
              escalões: escaloesAtualizados,
            };
          }
          return modalidade;
        })
        .filter((modalidade) => modalidade.escalões.length > 0);
    });
  };

  const filteredEquipas = equipas
    .filter((equipa) =>
      selectedModalidade.length > 0 ? selectedModalidade.includes(equipa.nome) : true
    )
    .filter((equipa) =>
      equipa.escalões.some((escalao) =>
        escalao.nome.toLowerCase().includes(search.toLowerCase())
      )
    );

  const handleModalidadeChange = (value: string) => {
    setSelectedModalidade((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  };

  return (
    <div className="space-y-8">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-semibold text-gray-700">Total de Modalidades</h3>
    <p className="text-lg font-bold text-gray-800">{equipas.length}</p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-semibold text-gray-700">Total de Escalões</h3>
    <p className="text-lg font-bold text-gray-800">
      {equipas.reduce((acc, equipa) => acc + equipa.escalões.length, 0)}
    </p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-semibold text-gray-700">Total de Atletas</h3>
    <p className="text-lg font-bold text-gray-800">
      {usuarios.filter((u) => u.perfil === "Atleta").length}
    </p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="text-sm font-semibold text-gray-700">Total de Treinadores</h3>
    <p className="text-lg font-bold text-gray-800">
      {usuarios.filter((u) => u.perfil === "Treinador").length}
    </p>
  </div>
</div>


      {/* Filtro e botão */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4 w-2/3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar por Escalão..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
              >
                <span>Modalidade</span>
                <FaChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute bg-white rounded-lg shadow-lg mt-2 w-48 p-2 z-10">
                  {equipas.map((equipa) => (
                    <label key={equipa.id} className="block px-4 py-2 text-sm">
                      <input
                        type="checkbox"
                        value={equipa.nome}
                        checked={selectedModalidade.includes(equipa.nome)}
                        onChange={() => handleModalidadeChange(equipa.nome)}
                        className="mr-2"
                      />
                      {equipa.nome}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsAddEscalaoModalOpen(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            + Novo Escalão
          </button>
        </div>

        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Escalão</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Modalidade</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Treinador</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Atletas</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
  {filteredEquipas.map((equipa) =>
    equipa.escalões.map((escalao, index) => (
      <tr key={`${equipa.id}-${index}`} className="border-t">
  <td className="px-6 py-2 text-sm text-gray-600">{escalao.nome}</td>
  <td className="px-6 py-2 text-sm text-gray-600">{equipa.nome}</td>

  {/* Treinadores atribuídos automaticamente */}
  <td className="px-6 py-2 text-sm text-gray-600">
    {
      JSON.parse(localStorage.getItem("usuarios") || "[]")
        .filter((u: any) => {
          const escaloes = Array.isArray(u.escalão) ? u.escalão : [u.escalão];
          return (
            u.perfil === "Treinador" &&
            u.modalidade === equipa.nome &&
            escaloes.includes(escalao.nome)
          );
        })
        .map((u: any) => u.nome)
        .join(", ") || "-"
    }
  </td>

  {/* Número de Atletas do escalão */}
  <td className="px-6 py-2 text-sm text-gray-600">
    {
      JSON.parse(localStorage.getItem("usuarios") || "[]").filter(
        (u: any) =>
          u.perfil === "Atleta" &&
          u.modalidade === equipa.nome &&
          u.escalão === escalao.nome
      ).length
    }
  </td>

  {/* Ações */}
  <td className="px-6 py-2 text-sm text-gray-600 flex gap-4">
    <button
      onClick={() => abrirModalEditarEscalao(escalao, equipa.nome)}
      className="text-gray-400 hover:text-gray-600"
    >
      <FaEdit />
    </button>
    <button
      onClick={() => removerEscalao(equipa.nome, escalao.nome)}
      className="text-gray-400 hover:text-gray-600"
    >
      <FaTrash />
    </button>
  </td>
</tr>

    ))
  )}
</tbody>

        </table>
      </div>

      {/* Modal: Novo Escalão */}
      {isAddEscalaoModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Novo Escalão</h2>

            <input
              type="text"
              value={novoEscalaoNome}
              onChange={(e) => setNovoEscalaoNome(e.target.value)}
              placeholder="Nome do Escalão"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />

            <select
              value={modalidadeSelecionada}
              onChange={(e) => setModalidadeSelecionada(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            >
              <option value="">Selecione uma Modalidade</option>
              {modalidadesDisponiveis.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>

            <div className="flex justify-between">
              <button
                onClick={() => setIsAddEscalaoModalOpen(false)}
                className="bg-gray-300 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarNovoEscalao}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Escalão */}
      {isEditEscalaoModalOpen && escalaoEditando && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Editar Escalão</h2>

            <input
              type="text"
              value={escalaoEditando.nome}
              onChange={(e) =>
                setEscalaoEditando({ ...escalaoEditando, nome: e.target.value })
              }
              placeholder="Nome do Escalão"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />

            <select
              value={modalidadeNova}
              onChange={(e) => setModalidadeNova(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            >
              {modalidadesDisponiveis.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>

            <div className="flex justify-between">
              <button
                onClick={() => setIsEditEscalaoModalOpen(false)}
                className="bg-gray-300 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicaoEscalao}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipas;
