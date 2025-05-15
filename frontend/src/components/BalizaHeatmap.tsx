import React from "react";


const zonasBaliza = [
    // Baliza
    { name: "Canto Superior Esquerdo", top: "21%", left: "12.5%", width: "12.5%", height: "14%" },
    { name: "Centro Superior", top: "21%", left: "25.5%", width: "40.5%", height: "14%" },
    { name: "Canto Superior Direito", top: "21%", left: "66.5%", width: "21.7%", height: "14%" },
    { name: "Meia Altura Esquerdo", top: "36%", left: "12.5%", width: "12.5%", height: "34%" },
    { name: "Meio da Baliza", top: "36%", left: "25.5%", width: "40.5%", height: "24%" },
    { name: "Meio da Baliza", top: "60%", left: "36.5%", width: "29.5%", height: "10%" },
    { name: "Sovaco", top: "60.5%", left: "25.5%", width: "10.5%", height: "10%" },
    { name: "Meia Altura Direito", top: "36%", left: "66.5%", width: "21.8%", height: "34.5%" },
    { name: "Canto Inferior Esquero", top: "70.5%", left: "12.5%", width: "12.5%", height: "13%" },
    { name: "Centro Inferior Rasteiro", top: "70.5%", left: "25.5%", width: "40.5%", height: "13%" },
    { name: "Canto Inferior Direito", top: "70.5%", left: "66.5%", width: "21.8%", height: "13%" },
    // Postes
    { name: "Barra Superior Esquerdo", top: "17%", left: "9.5%", width: "15.5%", height: "3%" },
    { name: "Barra Superior Meio", top: "17%", left: "25.5%", width: "40.5%", height: "3%" },
    { name: "Barra Superior Direito", top: "17%", left: "66.5%", width: "24%", height: "3%" },
    { name: "Poste Superior Esquerdo", top: "21%", left: "9.5%", width: "2.5%", height: "14%" },
    { name: "Posts Meia Altura Esquerdo", top: "36%", left: "9.5%", width: "2.5%", height: "34%" },
    { name: "Poste Inferior Esquerdo", top: "70.5%", left: "9.5%", width: "2.5%", height: "12%" },
    { name: "Poste Superior Direito", top: "21%", left: "88.5%", width: "2%", height: "14%" },
    { name: "Poste Meia Altura Direito", top: "36%", left: "88.5%", width: "2%", height: "34%" },
    { name: "Poste Inferior Direito", top: "70.5%", left: "88.5%", width: "2%", height: "12%" },
    // Fora
    { name: "Fora Superior Barra Esquerdo", top: "10%", left: "4.5%", width: "20.5%", height: "6.5%" },
    { name: "Fora Superior Barra Meio", top: "10%", left: "25.5%", width: "40.5%", height: "6.5%" },
    { name: "Fora Superior Barra Direito", top: "10%", left: "66.5%", width: "29.5%", height: "6.5%" },
    { name: "Fora Superior Esquerdo", top: "17%", left: "4.5%", width: "4.5%", height: "18%" },
    { name: "Fora Meia Altura Esquerdo", top: "36%", left: "4.5%", width: "4.5%", height: "34%" },
    { name: "Fora Inferior Esquerdo", top: "70.5%", left: "4.5%", width: "4.5%", height: "12.5%" },
    { name: "Fora Superior Direito", top: "17%", left: "91%", width: "5%", height: "18%" },
    { name: "Fora Meia Altura Direito", top: "36%", left: "91%", width: "5%", height: "34%" },
    { name: "Fora Inferior Direito", top: "70.5%", left: "91%", width: "5%", height: "12.5%" },
  ];
  
const BalizaHeatmap = ({
  dados,
  filtro = "todos"
}: {
  dados: Record<string, { total: number; golo: number; falhado: number }>,
  filtro: "todos" | "golo" | "falhado"
}) => {
  const getValor = (zona: string) => {
    if (!dados[zona]) return 0;
    if (filtro === "todos") return dados[zona].total;
    if (filtro === "golo") return dados[zona].golo;
    if (filtro === "falhado") return dados[zona].falhado;
    return 0;
  };

  const max = Math.max(...Object.keys(dados).map(getValor), 1);

  const getColor = (valor: number) => {
    const intensidade = valor / max;
  
    if (filtro === "golo") {
      // Verde: vai de #e6f9e6 (claro) a #008000 (escuro)
      const green = Math.floor(230 - intensidade * 150);
      return `rgba(0, ${150 + intensidade * 105}, 0, ${0.3 + intensidade * 0.7})`;
    }
  
    if (filtro === "falhado") {
      // Vermelho: vai de #ffe6e6 (claro) a #cc0000 (escuro)
      const red = Math.floor(204 + intensidade * 50);
      return `rgba(${red}, 0, 0, ${0.3 + intensidade * 0.7})`;
    }
  
    // Amarelo: vai de #fffde6 a #ffaa00
    const r = 255;
    const g = Math.floor(255 - intensidade * 55); // 255 → 200
    const b = 0;
    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensidade * 0.7})`;
  };
  

  return (
    <div className="relative w-full max-w-[400px] aspect-[4/3] mx-auto">
      <img src="/baliza.png" className="w-full h-full object-contain" />
      {Object.keys(dados).map((zonaName) => {
        const valor = getValor(zonaName);
        const zona = zonasBaliza.find(z => z.name === zonaName);
        if (!zona || valor === 0) return null;

        return (
          <div
            key={zona.name}
            title={`${zona.name} (${valor})`}
            className="absolute rounded"
            style={{
              top: zona.top,
              left: zona.left,
              width: zona.width,
              height: zona.height,
              backgroundColor: getColor(valor),
            }}
          />
        );
      })}
    </div>
  );
};

export default BalizaHeatmap;

  