import { HistoryIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const AtividadeRecente = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {

    const dados = [
      { id: 1, usuario: "Ana Clara Blefari", status: "Rejeitada", motivo: "Consulta médica", data: "2025-09-12T08:00:00" },
      { id: 2, usuario: "Beatriz Frizina", status: "Aprovada", motivo: "Consulta médica", data: "2025-09-12T07:30:00" },
      { id: 3, usuario: "Ana Clara Blefari", status: "Aprovada", motivo: "Consulta médica", data: "2025-09-12T07:00:00" },
      { id: 4, usuario: "Carlos Silva", status: "Aprovada", motivo: "Consulta médica", data: "2025-09-12T06:00:00" },
    ];


    const ultimas = dados
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 3);

    setSolicitacoes(ultimas);
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-white shadow-sm">
    <div className="flex items-center space-x-2 ">
      <h2 className="font-semibold mb-3">Atividade Recente</h2>
        </div>
      {solicitacoes.map((item) => (
        <div
          key={item.id}
          className="p-4.5 mb-4 rounded-xl bg-secondary-100  flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{item.usuario}</p>
            <p className="text-sm text-gray-500">
              {item.motivo} • {new Date(item.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <span
            className={`px-2 py-1 text-sm rounded-full ${
              item.status === "Aprovada"
                ? " border border-green-200 text-success"
                : "bg-danger text-white border border-red-200"
            }`}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AtividadeRecente;
