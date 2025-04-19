// src/pages/DashboardAdmin.tsx
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, Layers, Medal, UserCheck } from "lucide-react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6666", "#66ccff"];

export default function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [modalidades, setModalidades] = useState<any[]>([]);
  const [equipas, setEquipas] = useState<any[]>([]);

  useEffect(() => {
    const storedUsuarios = localStorage.getItem("usuarios");
    const storedModalidades = localStorage.getItem("modalidades");
    const storedEquipas = localStorage.getItem("equipas");

    if (storedUsuarios) setUsuarios(JSON.parse(storedUsuarios));
    if (storedModalidades) setModalidades(JSON.parse(storedModalidades));
    if (storedEquipas) setEquipas(JSON.parse(storedEquipas));
  }, []);

  const pieData = modalidades.map((modalidade: any) => {
    const nome = modalidade.nome;
    const total = usuarios.filter((u) => u.modalidade === nome).length;
    return { name: nome, value: total };
  });

  const totalAtletas = usuarios.filter((u) => u.perfil?.includes("Atleta")).length;
  const totalTreinadores = usuarios.filter((u) => u.perfil?.includes("Treinador")).length;
  const totalEquipas = equipas.reduce(
    (acc: number, equipa: any) => acc + (equipa.escalões?.length || 0),
    0
  );
  const totalModalidades = modalidades.length;

  const stats = [
    {
      title: "Total de Atletas",
      value: totalAtletas,
      icon: <Users className="w-5 h-5 mr-2 text-blue-500" />,
    },
    {
      title: "Total de Escalões",
      value: totalEquipas,
      icon: <Layers className="w-5 h-5 mr-2 text-green-500" />,
    },
    {
      title: "Total de Modalidades",
      value: totalModalidades,
      icon: <Medal className="w-5 h-5 mr-2 text-yellow-500" />,
    },
    {
      title: "Total de Treinadores",
      value: totalTreinadores,
      icon: <UserCheck className="w-5 h-5 mr-2 text-red-500" />,
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Estatísticas Gerais</h2>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl shadow p-4">
            <div className="mb-2 flex items-center text-sm text-gray-500 font-medium">
              {stat.icon}
              {stat.title}
            </div>
            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de pizza */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Utilizadores por Modalidade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Últimos usuários cadastrados */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Últimos Usuários Cadastrados</h3>
          <ul className="space-y-4">
            {[...usuarios].slice(-5).reverse().map((user, index) => (
              <li key={user.id} className="flex items-center gap-4">
                <img
                  src={user.foto}
                  alt={user.nome}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.nome}</p>
                  <p className="text-sm text-gray-500">
                     {Array.isArray(user.perfil) ? user.perfil.join(", ") : user.perfil} • {user.email}
                     </p>

                </div>
                <span className="ml-auto text-xs text-gray-400">
                  há {5 * (index + 1)} min
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
