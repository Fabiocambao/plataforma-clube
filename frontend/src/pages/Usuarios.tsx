import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash, FaLock, FaSearch, FaTimes } from "react-icons/fa";
import { ChevronDown } from "lucide-react";


const Usuarios = () => {
  const [usuarios, setUsuarios] = useState(() => {
    const stored = localStorage.getItem("usuarios");
    return stored ? JSON.parse(stored) : [];
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [filtroPerfil, setFiltroPerfil] = useState<string[]>([]);
  const [filtroModalidade, setFiltroModalidade] = useState<string[]>([]);
  const [filtroEscalão, setFiltroEscalão] = useState<string[]>([]);

  const [isPerfilOpen, setIsPerfilOpen] = useState(false);
  const [isModalidadeOpen, setIsModalidadeOpen] = useState(false);
  const [isEscalãoOpen, setIsEscalãoOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);

  const funcoesRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (funcoesRef.current && !funcoesRef.current.contains(event.target as Node)) {
      setFuncoesDropdownAberto(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


const [novoUsuario, setNovoUsuario] = useState({
  nome: "",
  email: "",
  dataNascimento: "",
  id: "",
  password: "",
  perfil: [] as string[],
  modalidade: "",
  escaloesTreinador: [] as string[],
  escalaoAtleta: "",
  posicao: "",
  foto: "",
});

const limparFormularioNovoUsuario = () => {
  setNovoUsuario({
    nome: "",
    email: "",
    dataNascimento: "",
    id: "",
    password: "",
    perfil: [],
    modalidade: "",
    escaloesTreinador: [],
    escalaoAtleta: "",
    posicao: "",
    foto: "",
  });
  setIsModalOpen(false);
  setFuncoesDropdownAberto(false);      // <- FECHA dropdown de funções
  setIsPerfilOpen(false);               // <- FECHA filtro de perfil se necessário
  setIsModalidadeOpen(false);          // <- FECHA filtro de modalidade
  setIsEscalãoOpen(false);             // <- FECHA filtro de escalão
};




useEffect(() => {
  const { nome, perfil } = novoUsuario;

  if (nome && perfil.length > 0) {
    const { id, password } = gerarIdEPassword(nome, perfil);
    setNovoUsuario((prev) => ({
      ...prev,
      id,
      password,
    }));
  }
}, [novoUsuario.nome, novoUsuario.perfil, usuarios]);




  const modalidades = JSON.parse(localStorage.getItem("modalidades") || "[]");
  const equipas = JSON.parse(localStorage.getItem("equipas") || "[]");

  const escaloesDisponiveis =
    equipas.find((e: any) => e.nome === novoUsuario.modalidade)?.escalões.map((e: any) => e.nome) || [];

  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);


  const filteredUsers = usuarios.filter(
    (user: any) =>
      (search === "" || user.nome?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase())) &&
      (filtroPerfil.length === 0 ||
        (Array.isArray(user.perfil)
          ? user.perfil.some((p: string) => filtroPerfil.includes(p))
          : filtroPerfil.includes(user.perfil))) &&
      (filtroModalidade.length === 0 || filtroModalidade.includes(user.modalidade)) &&
      (filtroEscalão.length === 0 || filtroEscalão.includes(user.escalão))
  );
  

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const toggleFilter = (filter: string[], value: string) =>
    filter.includes(value) ? filter.filter((item) => item !== value) : [...filter, value];

  const clearFilters = () => {
    setFiltroPerfil([]);
    setFiltroModalidade([]);
    setFiltroEscalão([]);
  };

  const removerUsuario = (id: string) => {
    const atualizados = usuarios.filter((u: any) => u.id !== id);
    setUsuarios(atualizados);
  }; 
  

  const handleAdicionarUsuario = () => {
    const perfil = novoUsuario.perfil;
  
    // ✅ Verifica se pelo menos um perfil precisa de modalidade
    const precisaDeModalidade = perfil.some((p) =>
      ["Treinador", "Atleta", "Analista", "Coordenador"].includes(p)
    );
  
    const novo = {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      password: novoUsuario.password,
      dataNascimento: novoUsuario.dataNascimento,
      perfil: perfil, // já é array
  
      // ✅ Se alguma função precisar de modalidade, guarda a correta
      modalidade: precisaDeModalidade ? novoUsuario.modalidade : "-",
  
      escalão:
        perfil.includes("Treinador") && perfil.includes("Atleta")
          ? {
              treinador: novoUsuario.escaloesTreinador,
              atleta: novoUsuario.escalaoAtleta,
            }
          : perfil.includes("Treinador")
          ? novoUsuario.escaloesTreinador
          : perfil.includes("Atleta")
          ? novoUsuario.escalaoAtleta
          : "-",
  
      posicao: novoUsuario.posicao || "",
      foto: novoUsuario.foto || "/avatar.png",
    };
  
    const atualizados = [...usuarios, novo];
    setUsuarios(atualizados);
    limparFormularioNovoUsuario();
  };
  

  const funcoesDisponiveis = [
    "Administrador",
    "Treinador",
    "Atleta",
    "Analista",
    "Fisioterapeuta",
    "Preparador Físico",
    "Coordenador"
  ];
  
  const [funcoesDropdownAberto, setFuncoesDropdownAberto] = useState(false);

  const precisaDeModalidade = novoUsuario.perfil.some((p) =>
    ["Treinador", "Atleta", "Analista", "Coordenador"].includes(p)
  );

  const precisaDeEscalao =
  (novoUsuario.perfil.includes("Treinador") || novoUsuario.perfil.includes("Atleta")) &&
  !novoUsuario.perfil.every((p) =>
    ["Administrador", "Fisioterapeuta", "Preparador Físico"].includes(p)
  );

  const gerarIdEPassword = (nome: string, perfil: string[]) => {
    if (!nome || perfil.length === 0) return { id: "", password: "" };
  
    const primeiroNome = nome.split(" ")[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const funcao = perfil[0].toLowerCase().replace(/\s+/g, "");
  
    // Obter o contador atual do localStorage
    const contadoresRaw = localStorage.getItem("contadoresUsuarios") || "{}";
    const contadores = JSON.parse(contadoresRaw);
  
    // Incrementa o contador para o nome atual
    const numeroAtual = contadores[primeiroNome] || 0;
    const novoNumero = numeroAtual + 1;
    contadores[primeiroNome] = novoNumero;
  
    /// Conta o total de utilizadores para gerar um número global único
  const numeroGlobal = String(usuarios.length + 1).padStart(3, "0");

  const id = `${primeiroNome}${numeroGlobal}_${funcao}`;
  const password = `${funcao}@${numeroGlobal}`;

  return { id, password };
};
  

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6 max-w-2xl">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <h3 className="text-sm font-semibold text-gray-700">Total de Atletas</h3>
            <p className="text-lg font-bold text-gray-800">
  {filteredUsers.filter(u => Array.isArray(u.perfil) && u.perfil.includes("Atleta")).length}
</p>


          </div>
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <h3 className="text-sm font-semibold text-gray-700">Total de Treinadores</h3>
            <p className="text-lg font-bold text-gray-800">
  {filteredUsers.filter(u => Array.isArray(u.perfil) && u.perfil.includes("Treinador")).length}
</p>

          </div>
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <h3 className="text-sm font-semibold text-gray-700">Total de Admins</h3>
            {filteredUsers.filter(u => Array.isArray(u.perfil) && u.perfil.includes("Administrador")).length}

          </div>
        </div>
        <div className="flex-1 p-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 ml-auto block"
          >
            + Novo Usuário
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="mb-4 flex items-center space-x-4">
          <div className="relative flex items-center w-full md:w-2/3">
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            {[["Função", filtroPerfil, setFiltroPerfil, setIsPerfilOpen, isPerfilOpen],
              ["Modalidade", filtroModalidade, setFiltroModalidade, setIsModalidadeOpen, isModalidadeOpen],
              ["Escalão", filtroEscalão, setFiltroEscalão, setIsEscalãoOpen, isEscalãoOpen]
            ].map(([label, filtro, setFiltro, setOpen, isOpen]: any) => {
              const values = label === "Função"
                ? ["Atleta", "Treinador", "Administrador"]
                : label === "Modalidade"
                ? modalidades.map((m: any) => m.nome)
                : equipas.flatMap((e: any) => e.escalões.map((es: any) => es.nome));
              return (
                <div className="relative" key={label}>
                  <button
                    onClick={() => setOpen(!isOpen)}
                    className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <span>{label}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {isOpen && (
                    <div className="absolute bg-white rounded-lg shadow-lg mt-2 w-48 z-10">
                      {values.map((val: string) => (
                        <label key={val} className="block px-4 py-2 flex items-center">
                          <input
                            type="checkbox"
                            checked={filtro.includes(val)}
                            onChange={() => setFiltro(toggleFilter(filtro, val))}
                            className="mr-2"
                          />
                          {val}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 mt-2">
            <FaTimes className="inline mr-2" /> Limpar Filtros
          </button>
        </div>

        <table className="min-w-full mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Usuário</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">ID</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Password</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Função</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Modalidade</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Escalão</th>
              <th className="px-6 py-2 text-left text-sm text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            {currentUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-100 border-t">
                <td className="px-6 py-2 text-sm text-gray-600 flex items-center">
                  <img src={user.foto} alt="foto" className="w-10 h-10 rounded-full mr-4" />
                  <div>
                    <div className="font-bold">{user.nome}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-2 text-sm text-gray-600">{user.id}</td>
                <td className="px-6 py-2 text-sm text-gray-600">{user.password}</td>
                <td className="px-6 py-2 text-sm text-gray-600">{Array.isArray(user.perfil) ? user.perfil.join(", ") : user.perfil}</td>
                <td className="px-6 py-2 text-sm text-gray-600">{user.modalidade}</td>
                <td className="px-6 py-2 text-sm text-gray-600">
  {typeof user.escalão === "object" && !Array.isArray(user.escalão) ? (
    <>
      {Object.entries(user.escalão).map(([papel, valor]) => {
        const valorStr = Array.isArray(valor)
          ? valor.join(", ")
          : String(valor);

        return (
          <div key={papel}>
            <strong>{papel}:</strong> {valorStr}
          </div>
        );
      })}
    </>
  ) : Array.isArray(user.escalão) ? (
    user.escalão.join(", ")
  ) : (
    user.escalão
  )}
</td>


                <td className="px-6 py-2 text-sm text-gray-600 flex gap-4 justify-center">
                <button
  onClick={() => setUsuarioEditando(user)}
  className="text-gray-400 hover:text-gray-600"
>
  <FaEdit />
</button>

<button
  onClick={() => removerUsuario(user.id)}
  className="text-gray-400 hover:text-gray-600"
>
  <FaTrash />
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarioEditando && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Editar Usuário</h2>

      <div className="flex flex-col items-center space-y-2">
        <label className="font-medium text-sm text-gray-600">Foto de Perfil</label>
        {usuarioEditando.foto && (
          <img
            src={usuarioEditando.foto}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover border"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const imageUrl = URL.createObjectURL(file);
              setUsuarioEditando({ ...usuarioEditando, foto: imageUrl });
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={usuarioEditando.nome}
          onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nome: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="ID de Utilizador"
          value={usuarioEditando.id}
          onChange={(e) => setUsuarioEditando({ ...usuarioEditando, id: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={usuarioEditando.dataNascimento}
          onChange={(e) => setUsuarioEditando({ ...usuarioEditando, dataNascimento: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Password"
          value={usuarioEditando.password}
          onChange={(e) => setUsuarioEditando({ ...usuarioEditando, password: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={() => setUsuarioEditando(null)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            const atualizados = usuarios.map((u) =>
              u.id === usuarioEditando.id ? usuarioEditando : u
            );
            setUsuarios(atualizados);
            setUsuarioEditando(null);
          }}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Guardar Alterações
        </button>
      </div>
    </div>
  </div>
)}


        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">Exibindo {currentUsers.length} de {usuarios.length} resultados</span>
          <div className="flex space-x-2 mt-2">
            <button onClick={() => currentPage > 1 && paginate(currentPage - 1)} className="px-3 py-1 text-xs rounded-lg bg-gray-200 hover:bg-gray-300">Anterior</button>
            {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)} className={`px-3 py-1 text-xs rounded-lg ${i + 1 === currentPage ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => currentPage < Math.ceil(filteredUsers.length / itemsPerPage) && paginate(currentPage + 1)} className="px-3 py-1 text-xs rounded-lg bg-gray-200 hover:bg-gray-300">Próximo</button>
          </div>
        </div>
      </div>

      {/* Modal de Novo Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Adicionar Novo Usuário</h2>

            <div className="flex flex-col items-center space-y-2">
              <label className="font-medium text-sm text-gray-600">Foto de Perfil</label>
              {novoUsuario.foto && (
                <img
                  src={novoUsuario.foto}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setNovoUsuario({ ...novoUsuario, foto: imageUrl });
                  }
                }}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
  type="text"
  placeholder="Nome Completo"
  value={novoUsuario.nome}
  onChange={(e) =>
    setNovoUsuario((prev) => ({
      ...prev,
      nome: e.target.value,
    }))
  }
  className="border p-2 rounded"
/>

              <input type="email" placeholder="Email" value={novoUsuario.email} onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })} className="border p-2 rounded" />

              
              

              <input
  type="date"
  value={novoUsuario.dataNascimento}
  onChange={(e) =>
    setNovoUsuario((prev) => ({
      ...prev,
      dataNascimento: e.target.value,
    }))
  }
  className="border p-2 rounded"
/>

<input
  type="text"
  placeholder="ID de Utilizador"
  value={novoUsuario.id}
  readOnly
  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
/>




              <input
  type="text"
  placeholder="Password"
  value={novoUsuario.password}
  readOnly
  className="border p-2 rounded bg-gray-100 cursor-not-allowed"
/>

              <div ref={funcoesRef} className="col-span-1 md:col-span-2 relative">
  <label className="text-sm font-medium text-gray-600 block mb-1">Funções (pode escolher várias)</label>
  <button
    type="button"
    onClick={() => setFuncoesDropdownAberto((prev) => !prev)}
    className="w-full border p-2 rounded flex justify-between items-center"
  >
    {novoUsuario.perfil.length > 0 ? novoUsuario.perfil.join(", ") : "Selecionar Funções"}
    <ChevronDown className="w-4 h-4 ml-2" />
  </button>

  {funcoesDropdownAberto && (
    <div className="absolute z-10 bg-white border rounded shadow-lg mt-1 w-full max-h-64 overflow-auto">
      {funcoesDisponiveis.map((funcao) => (
        <label key={funcao} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm">
          <input
  type="checkbox"
  checked={novoUsuario.perfil.includes(funcao)}
  onChange={() => {
    const atualizadas = novoUsuario.perfil.includes(funcao)
      ? novoUsuario.perfil.filter((f) => f !== funcao)
      : [...novoUsuario.perfil, funcao];

      const { id, password } = gerarIdEPassword(novoUsuario.nome, atualizadas);

    setNovoUsuario({ ...novoUsuario, perfil: atualizadas, id, password });
  }}
/>
          {funcao}
        </label>
      ))}
    </div>
  )}
</div>


{precisaDeModalidade && (
  <select
    value={novoUsuario.modalidade}
    onChange={(e) =>
      setNovoUsuario({
        ...novoUsuario,
        modalidade: e.target.value,
        escaloesTreinador: [],
        escalaoAtleta: "",
        posicao: "",
      })
    }
    className="border p-2 rounded col-span-1 md:col-span-2"
  >
    <option value="">Selecione a Modalidade</option>
    {modalidades.map((mod: any) => (
      <option key={mod.id} value={mod.nome}>
        {mod.nome}
      </option>
    ))}
  </select>
)}

            
{precisaDeEscalao && (
  <>
    {novoUsuario.perfil.includes("Treinador") && escaloesDisponiveis.length > 0 && (
      <div className="col-span-1 md:col-span-2">
        <label className="text-sm font-medium text-gray-600 block mb-1">
          Escalões onde é Treinador
        </label>
        <div className="flex flex-wrap gap-2">
          {escaloesDisponiveis.map((escalao: string) => (
            <label key={escalao} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={novoUsuario.escaloesTreinador.includes(escalao)}
                onChange={() => {
                  const atualizado = novoUsuario.escaloesTreinador.includes(escalao)
                    ? novoUsuario.escaloesTreinador.filter((e) => e !== escalao)
                    : [...novoUsuario.escaloesTreinador, escalao];
                  setNovoUsuario({ ...novoUsuario, escaloesTreinador: atualizado });
                }}
              />
              {escalao}
            </label>
          ))}
        </div>
      </div>
    )}

    {novoUsuario.perfil.includes("Atleta") && escaloesDisponiveis.length > 0 && (
      <div className="col-span-1 md:col-span-2">
        <label className="text-sm font-medium text-gray-600 block mb-1">
          Escalão onde é Atleta
        </label>
        <select
          value={novoUsuario.escalaoAtleta}
          onChange={(e) =>
            setNovoUsuario({ ...novoUsuario, escalaoAtleta: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          <option value="">Selecione o Escalão</option>
          {escaloesDisponiveis.map((escalao: string) => (
            <option key={escalao} value={escalao}>
              {escalao}
            </option>
          ))}
        </select>
      </div>
    )}
  </>
)}


              {novoUsuario.perfil.includes("Atleta") && novoUsuario.modalidade === "Hóquei em Patins" && (
                <select value={novoUsuario.posicao} onChange={(e) => setNovoUsuario({ ...novoUsuario, posicao: e.target.value })} className="border p-2 rounded col-span-1 md:col-span-2">
                  <option value="">Selecione a Posição</option>
                  <option value="Jogador de Campo">Jogador de Campo</option>
                  <option value="Guarda-Redes">Guarda-Redes</option>
                </select>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button onClick={limparFormularioNovoUsuario} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
              <button onClick={handleAdicionarUsuario} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
