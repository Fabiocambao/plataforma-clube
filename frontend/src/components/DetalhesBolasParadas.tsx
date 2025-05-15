import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const cores = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

type Props = {
  jogos: any[];
};

const DetalhesBolasParadas: React.FC<Props> = ({ jogos }) => {
  const ofensivas = {
    "Penálti Marcado": 0,
    "Recarga Penálti Marcado": 0,
    "Livre Direto Marcado": 0,
    "Recarga Livre Direto Marcado": 0,
    "Penálti Falhado": 0,
    "Livre Direto Falhado": 0,
  };

  const defensivas = {
    "Penálti Sofrido": 0,
    "Recarga Penálti Sofrido": 0,
    "Livre Direto Sofrido": 0,
    "Recarga Livre Direto Sofrido": 0,
    "Penálti Defendido": 0,
    "Livre Direto Defendido": 0,
  };

  jogos.forEach((jogo) => {
    const estat = jogo.estatisticas;
    if (!estat) return;

    Object.keys(ofensivas).forEach((key) => {
      ofensivas[key] += (estat.ofensivas?.[key] || 0);
    });

    Object.keys(defensivas).forEach((key) => {
      defensivas[key] += (estat.defensivas?.[key] || 0);
    });
  });

  const mapaAbreviacoes = {
    "Penálti Marcado": "PM",
    "Recarga Penálti Marcado": "RPM",
    "Livre Direto Marcado": "LDM",
    "Recarga Livre Direto Marcado": "RLDM",
    "Penálti Falhado": "PF",
    "Livre Direto Falhado": "LDF",
    "Penálti Sofrido": "PS",
    "Recarga Penálti Sofrido": "RPS",
    "Livre Direto Sofrido": "LDS",
    "Recarga Livre Direto Sofrido": "RLDS",
    "Penálti Defendido": "PD",
    "Livre Direto Defendido": "LDD",
  };

  const totalOfensivas = Object.values(ofensivas).reduce((a, b) => a + b, 0);
  const totalDefensivas = Object.values(defensivas).reduce((a, b) => a + b, 0);

  const dataOfensivas = Object.entries(ofensivas).map(([nomeCompleto, valor]) => ({
    name: mapaAbreviacoes[nomeCompleto],
    full: nomeCompleto,
    value: valor,
    percent: totalOfensivas > 0 ? ((valor / totalOfensivas) * 100).toFixed(1) : "0.0",
  }));

  const dataDefensivas = Object.entries(defensivas).map(([nomeCompleto, valor]) => ({
    name: mapaAbreviacoes[nomeCompleto],
    full: nomeCompleto,
    value: valor,
    percent: totalDefensivas > 0 ? ((valor / totalDefensivas) * 100).toFixed(1) : "0.0",
  }));

  const totalMarcadas =
    ofensivas["Penálti Marcado"] +
    ofensivas["Recarga Penálti Marcado"] +
    ofensivas["Livre Direto Marcado"] +
    ofensivas["Recarga Livre Direto Marcado"];

  const totalFalhadas =
    ofensivas["Penálti Falhado"] + ofensivas["Livre Direto Falhado"];

  const pieDataOfensivas = [
    { name: "Bola Parada Marcada", value: totalMarcadas },
    { name: "Bola Parada Falhada", value: totalFalhadas },
  ];

  const totalSofrida =
    defensivas["Penálti Sofrido"] +
    defensivas["Recarga Penálti Sofrido"] +
    defensivas["Livre Direto Sofrido"] +
    defensivas["Recarga Livre Direto Sofrido"];

  const totalDefendida =
    defensivas["Penálti Defendido"] + defensivas["Livre Direto Defendido"];

  const pieDataDefensivas = [
    { name: "Bola Parada Sofrida", value: totalSofrida },
    { name: "Bola Parada Defendida", value: totalDefendida },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Ofensivas */}
      <div className="bg-white p-4 rounded shadow min-h-[620px] flex flex-col justify-between">
        <h3 className="text-lg font-bold mb-4 text-center">Bolas Paradas Ofensivas</h3>

        <table className="w-full text-sm text-left mb-4">
          <thead>
            <tr className="text-gray-600">
              <th>Tipo</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {dataOfensivas.map((item) => (
              <tr key={item.name} className="border-t">
                <td>{item.full}</td>
                <td>{item.value}</td>
                <td>{item.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col md:flex-row gap-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataOfensivas}>
              <XAxis
                dataKey="name"
                tickFormatter={(name) => name}
                tick={{ fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value, name, props) => {
                const entry = dataOfensivas.find((d) => d.name === props.payload.name);
                return [value, entry?.full || name];
              }} />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieDataOfensivas}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {pieDataOfensivas.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Defensivas */}
      <div className="bg-white p-4 rounded shadow min-h-[620px] flex flex-col justify-between">
        <h3 className="text-lg font-bold mb-4 text-center">Bolas Paradas Defensivas</h3>

        <table className="w-full text-sm text-left mb-4">
          <thead>
            <tr className="text-gray-600">
              <th>Tipo</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {dataDefensivas.map((item) => (
              <tr key={item.name} className="border-t">
                <td>{item.full}</td>
                <td>{item.value}</td>
                <td>{item.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col md:flex-row gap-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataDefensivas}>
              <XAxis
                dataKey="name"
                tickFormatter={(name) => name}
                tick={{ fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value, name, props) => {
                const entry = dataDefensivas.find((d) => d.name === props.payload.name);
                return [value, entry?.full || name];
              }} />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieDataDefensivas}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {pieDataDefensivas.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DetalhesBolasParadas;
