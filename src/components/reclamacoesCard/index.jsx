import React from "react";
import { Clock, CheckCircle, Tag, User, Calendar } from "lucide-react";

const ReclamacoesCard = ({ reclamacoes = [], onGerenciar, getTipoNome, getFuncionarioNome }) => {
  const getPrioridadeClass = (rec) => {
    if (rec.lcdtpreclamacao === 1) return "bg-red-500 text-white";
    if (rec.lcdtpreclamacao === 2) return "bg-yellow-400 text-gray-800";
    return "bg-green-500 text-white";
  };

  const renderStatus = (status) => {
    switch (status) {
      case "A":
        return <span className="flex items-center gap-1 text-blue-600 font-medium text-xs sm:text-sm"><Clock size={14} /> Aberta</span>;
      case "E":
        return <span className="flex items-center gap-1 text-gray-600 font-medium text-xs sm:text-sm"><Clock size={14} /> Em Andamento</span>;
      case "C":
        return <span className="flex items-center gap-1 text-green-600 font-medium text-xs sm:text-sm"><CheckCircle size={14} /> Concluída</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const renderPrioridadeLabel = (rec) => {
    const label = rec.lcdtpreclamacao === 1 ? "Alta" : rec.lcdtpreclamacao === 2 ? "Média" : "Baixa";
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPrioridadeClass(rec)}`}>{label}</span>;
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-200 w-full">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Reclamações dos Colaboradores</h2>
      <p className="text-gray-500 text-sm mb-4">{reclamacoes.length} reclamação(ões) encontrada(s)</p>

      {/* DESKTOP */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-500">Data</th>
              <th className="px-4 py-2 text-gray-500">Colaborador</th>
              <th className="px-4 py-2 text-gray-500">Tipo</th>
              <th className="px-4 py-2 text-gray-500">Título</th>
              <th className="px-4 py-2 text-gray-500">Prioridade</th>
              <th className="px-4 py-2 text-gray-500">Status</th>
              <th className="px-4 py-2 text-gray-500">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reclamacoes.map((rec) => (
              <tr key={rec.cdReclamacao} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 text-gray-700">{new Date(rec.reclamacao).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-2 font-medium text-gray-800">{getFuncionarioNome?.(rec.cdFuncionario)}</td>
                <td className="px-4 py-2 text-gray-700">{getTipoNome?.(rec.cdTpReclamacao)}</td>
                <td className="px-4 py-2 text-gray-700 truncate max-w-[200px]">{rec.descricao}</td>
                <td className="px-4 py-2">{renderPrioridadeLabel(rec)}</td>
                <td className="px-4 py-2">{renderStatus(rec.status)}</td>
                <td onClick={() => onGerenciar?.(rec)} className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer">Gerenciar</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden grid gap-3 sm:gap-4 w-full">
        {reclamacoes.map((rec) => (
          <div key={rec.cdReclamacao} className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-3 sm:p-4 w-full">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">{rec.descricao}</p>
              {renderPrioridadeLabel(rec)}
            </div>

            <div className="text-xs sm:text-sm text-gray-600 mb-2 grid grid-cols-2 gap-y-1">
              <div className="flex items-center gap-1 col-span-2">
                <User size={14} className="text-indigo-500" />
                <span>{getFuncionarioNome?.(rec.cdFuncionario)}</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <Calendar size={14} className="text-indigo-500" />
                <span>{new Date(rec.reclamacao).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <Tag size={14} className="text-indigo-500" />
                <span>{getTipoNome?.(rec.cdTpReclamacao)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {renderStatus(rec.status)}
              <button onClick={() => onGerenciar?.(rec)} className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Gerenciar →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReclamacoesCard;
