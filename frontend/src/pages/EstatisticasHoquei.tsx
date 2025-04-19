import React, { useState } from "react";

interface EstatisticasHoqueiProps {
  jogadoresDisponiveis: any[];
  estatisticasIniciais?: {
    jogadoresCampo?: any[];
    guardaRedes?: any[];
  };
  onGuardar: (data: any) => void;
  onCancelar: () => void;
}


export default function EstatisticasHoquei({
  jogadoresDisponiveis,
  estatisticasIniciais,
  onGuardar,
  onCancelar,
}: EstatisticasHoqueiProps) {
  const estatisticaInicialCampo = {
    id: "",
    titular: false,
    golos: "",
    assistencias: "",
    minutos: "",
    faltas: "",
    azuis: "",
    vermelhos: "",
    penaltisMarcados: "",
    penaltisFalhados: "",
    livresDiretosMarcados: "",
    livresDiretosFalhados: "",
    bolasPerdidas: "",
    bolasRecuperadas: "",
  };


  const estatisticaGR = {
    id: "",
    titular: false,
    golosSofridos: "",
    defesas: "",
    minutos: "",
    azuis: "",
    vermelhos: "",
    penaltisDefendidos: "",
    penaltisSofridos: "",
    livresDiretosDefendidos: "",
    livresDiretosSofridos: "",
  };

  const [jogadoresCampo, setJogadoresCampo] = useState(
    estatisticasIniciais?.jogadoresCampo || Array(8).fill(null).map(() => ({ ...estatisticaInicialCampo }))
  );

  const [guardaRedes, setGuardaRedes] = useState(
    estatisticasIniciais?.guardaRedes ||
    Array(2).fill(null).map(() => ({ ...estatisticaGR }))
  );
   


  const handleCampoChange = (index: number, campo: string, valor: any) => {
    const atualizados = [...jogadoresCampo];
    atualizados[index][campo] = valor;
    setJogadoresCampo(atualizados);
  };

  const handleGRChange = (index: number, campo: string, valor: any) => {
    const atualizados = [...guardaRedes];
    atualizados[index][campo] = valor;
    setGuardaRedes(atualizados);
  };

  const getNomeById = (id: string) => {
    return jogadoresDisponiveis.find((j) => j.id === id)?.nome || "";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">🏑 Jogadores de Campo</h3>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-1">Nome</th>
            <th className="p-1">5 Inicial</th>
            <th className="p-1">Golos</th>
            <th className="p-1">Assist.</th>
            <th className="p-1">Min</th>
            <th className="p-1">Faltas</th>
            <th className="p-1">Azuis</th>
            <th className="p-1">Verm.</th>
            <th className="p-1">Pen. M/F</th>
            <th className="p-1">LD M/F</th>
            <th className="p-1">B. Perdidas</th>
            <th className="p-1">B. Recuperadas</th>
          </tr>
        </thead>
        <tbody>
          {jogadoresCampo.map((j, i) => (
            <tr key={i} className="border-t">
              <td className="p-1">
                <select
                  value={j.id}
                  onChange={(e) => handleCampoChange(i, "id", e.target.value)}
                  className="w-full border rounded p-1"
                >
                  <option value="">Selecionar jogador</option>
                  {jogadoresDisponiveis.map((j) => (
                    <option key={j.id} value={j.id}>{j.nome}</option>
                  ))}
                </select>
              </td>
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={j.titular}
                  onChange={(e) => handleCampoChange(i, "titular", e.target.checked)}
                />
              </td>
              <td className="p-1">
                <input value={j.golos} onChange={(e) => handleCampoChange(i, "golos", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={j.assistencias} onChange={(e) => handleCampoChange(i, "assistencias", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={j.minutos} onChange={(e) => handleCampoChange(i, "minutos", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={j.faltas} onChange={(e) => handleCampoChange(i, "faltas", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={j.azuis} onChange={(e) => handleCampoChange(i, "azuis", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={j.vermelhos} onChange={(e) => handleCampoChange(i, "vermelhos", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input
                  value={`${j.penaltisMarcados}/${j.penaltisFalhados}`}
                  onChange={(e) => {
                    const [m, f] = e.target.value.split("/");
                    handleCampoChange(i, "penaltisMarcados", m);
                    handleCampoChange(i, "penaltisFalhados", f);
                  }}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="p-1">
                <input
                  value={`${j.livresDiretosMarcados}/${j.livresDiretosFalhados}`}
                  onChange={(e) => {
                    const [m, f] = e.target.value.split("/");
                    handleCampoChange(i, "livresDiretosMarcados", m);
                    handleCampoChange(i, "livresDiretosFalhados", f);
                  }}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="p-1">
                <input value={j.bolasPerdidas} onChange={(e) => handleCampoChange(i, "bolasPerdidas", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={j.bolasRecuperadas} onChange={(e) => handleCampoChange(i, "bolasRecuperadas", e.target.value)} className="w-full border rounded p-1" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-bold pt-6">🧤 Guarda-Redes</h3>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-1">Nome</th>
            <th className="p-1">5 Inicial</th>
            <th className="p-1">G. Sofridos</th>
            <th className="p-1">Defesas</th>
            <th className="p-1">Min</th>
            <th className="p-1">Azuis</th>
            <th className="p-1">Verm.</th>
            <th className="p-1">Pen. Def/Sof</th>
            <th className="p-1">LD Def/Sof</th>
          </tr>
        </thead>
        <tbody>
          {guardaRedes.map((g, i) => (
            <tr key={i} className="border-t">
              <td className="p-1">
                <select
                  value={g.id}
                  onChange={(e) => handleGRChange(i, "id", e.target.value)}
                  className="w-full border rounded p-1"
                >
                  <option value="">Selecionar GR</option>
                  {jogadoresDisponiveis.map((j) => (
                    <option key={j.id} value={j.id}>{j.nome}</option>
                  ))}
                </select>
              </td>
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={g.titular}
                  onChange={(e) => handleGRChange(i, "titular", e.target.checked)}
                />
              </td>
              <td className="p-1">
                <input value={g.golosSofridos} onChange={(e) => handleGRChange(i, "golosSofridos", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={g.defesas} onChange={(e) => handleGRChange(i, "defesas", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={g.minutos} onChange={(e) => handleGRChange(i, "minutos", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={g.azuis} onChange={(e) => handleGRChange(i, "azuis", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input value={g.vermelhos} onChange={(e) => handleGRChange(i, "vermelhos", e.target.value)} className="w-full border rounded p-1" />
              </td>
              <td className="p-1">
                <input
                  value={`${g.penaltisDefendidos}/${g.penaltisSofridos}`}
                  onChange={(e) => {
                    const [d, s] = e.target.value.split("/");
                    handleGRChange(i, "penaltisDefendidos", d);
                    handleGRChange(i, "penaltisSofridos", s);
                  }}
                  className="w-full border rounded p-1"
                />
              </td>
              <td className="p-1">
                <input
                  value={`${g.livresDiretosDefendidos}/${g.livresDiretosSofridos}`}
                  onChange={(e) => {
                    const [d, s] = e.target.value.split("/");
                    handleGRChange(i, "livresDiretosDefendidos", d);
                    handleGRChange(i, "livresDiretosSofridos", s);
                  }}
                  className="w-full border rounded p-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right pt-4">
        <button onClick={onCancelar} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 mr-2">
          Cancelar
        </button>
        <button
          onClick={() => onGuardar({ jogadoresCampo, guardaRedes })}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Guardar Estatísticas
        </button>
      </div>
    </div>
  );
}
