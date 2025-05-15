import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";

const cores = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];
const tipos = ["Ataque Organizado", "Ataque Rápido", "Power Play", "Under Play"];

const DetalhesGolos = ({ jogos }: { jogos: any[] }) => {
  const golos = {
    marcados: {} as Record<string, number>,
    sofridos: {} as Record<string, number>,
  };

  tipos.forEach((tipo) => {
    golos.marcados[tipo] = jogos.reduce((acc, jogo) => acc + (jogo.marcados[tipo] || 0), 0);
    golos.sofridos[tipo] = jogos.reduce((acc, jogo) => acc + (jogo.sofridos[tipo] || 0), 0);
  });

  const totalMarcados = Object.values(golos.marcados).reduce((acc, val) => acc + val, 0);
  const totalSofridos = Object.values(golos.sofridos).reduce((acc, val) => acc + val, 0);

  const dataMarcados = tipos.map((tipo) => ({
    name: tipo,
    value: golos.marcados[tipo],
    percent: totalMarcados > 0 ? ((golos.marcados[tipo] / totalMarcados) * 100).toFixed(1) : "0.0"
  }));

  const dataSofridos = tipos.map((tipo) => ({
    name: tipo,
    value: golos.sofridos[tipo],
    percent: totalSofridos > 0 ? ((golos.sofridos[tipo] / totalSofridos) * 100).toFixed(1) : "0.0"
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Golos Marcados */}
      <div className="bg-white p-6 rounded shadow min-h-[500px]">
        <h3 className="text-lg font-bold mb-4 text-center">Análise de Golos Marcados</h3>

        <table className="w-full text-sm text-left mb-4">
          <thead>
            <tr className="text-gray-600">
              <th>Tipo</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {dataMarcados.map((item) => (
              <tr key={item.name} className="border-t">
                <td>{item.name}</td>
                <td>{item.value}</td>
                <td>{item.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-wrap gap-6 justify-between">
          <div className="flex-1 min-w-[300px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataMarcados}>
                <XAxis dataKey="name" tick={{ fontSize: 11, textAnchor: "middle" }} interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 min-w-[250px]">
            <PieChart width={250} height={250}>
              <Pie
                data={dataMarcados}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {dataMarcados.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>

      {/* Golos Sofridos */}
      <div className="bg-white p-6 rounded shadow min-h-[500px]">
        <h3 className="text-lg font-bold mb-4 text-center">Análise de Golos Sofridos</h3>

        <table className="w-full text-sm text-left mb-4">
          <thead>
            <tr className="text-gray-600">
              <th>Tipo</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {dataSofridos.map((item) => (
              <tr key={item.name} className="border-t">
                <td>{item.name}</td>
                <td>{item.value}</td>
                <td>{item.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-wrap gap-6 justify-between">
          <div className="flex-1 min-w-[300px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataSofridos}>
                <XAxis dataKey="name" tick={{ fontSize: 11, textAnchor: "middle" }} interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 min-w-[250px]">
            <PieChart width={250} height={250}>
              <Pie
                data={dataSofridos}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {dataSofridos.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesGolos;
