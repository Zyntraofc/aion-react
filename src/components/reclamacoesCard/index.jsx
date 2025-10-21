import React from "react";
import { Clock, CheckCircle } from "lucide-react";

const ReclamacoesCard = ({ reclamacoes, onGerenciar, getTipoNome }) => {

  const getPrioridadeClass = (rec) => {
    if (rec.cdTpReclamacao === 1) return "bg-red-500 text-white"; // Alta
    if (rec.cdTpReclamacao === 2) return "bg-yellow-400 text-gray-800"; // Média
    return "bg-green-500 text-white";
  };

  const renderStatus = (status) => {
    switch (status) {
      case "A":
        return <span className="flex items-center gap-1 text-blue-600 font-medium"><Clock size={16} />Em análise</span>;
      case "E":
        return <span className="flex items-center gap-1 text-gray-600 font-medium"><Clock size={16} />Pendente</span>;
      case "C":
        return <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle size={16} />Concluída</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        Reclamações dos Colaboradores
      </h2>
      <p className="text-gray-500 mb-4">
        {reclamacoes.length} reclamação(ões) encontrada(s)
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm text-gray-500">Data</th>
              <th className="px-4 py-2 text-sm text-gray-500">Colaborador</th>
              <th className="px-4 py-2 text-sm text-gray-500">Tipo</th>
              <th className="px-4 py-2 text-sm text-gray-500">Título</th>
              <th className="px-4 py-2 text-sm text-gray-500">Prioridade</th>
              <th className="px-4 py-2 text-sm text-gray-500">Status</th>
              <th className="px-4 py-2 text-sm text-gray-500">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reclamacoes.map((rec, index) => (
              <tr key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                <td className="px-4 py-2 text-sm text-gray-700">{new Date(rec.reclamacao).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-2 text-sm font-semibold text-gray-800">{rec.cdFuncionario}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{getTipoNome(rec.cdTpReclamacao)}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{rec.descricao}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeClass(rec)}`}>
                    {rec.cdTpReclamacao === 1 ? "Alta" : rec.cdTpReclamacao === 2 ? "Média" : "Baixa"}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">{renderStatus(rec.status)}</td>
                <td
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  onClick={() => onGerenciar(rec)}
                >
                  Gerenciar
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReclamacoesCard;
