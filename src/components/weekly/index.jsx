import { TrendingUp, TrendingDown, ArrowBigUpDash } from "lucide-react";

function Weekly({ numberRequestsAproved, numberRequestsRejected, aprovedPercentage }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-300 shadow-sm h-95 bg-gray-50">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp size={20} className="text-blue-500"/>
        <h1 className="text-xl font-bold text-gray-800">Resumo Semanal</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <p className="text-gray-500">Aprovadas</p>
          <TrendingUp size={20} className="text-green-500"/>
        </div>
        <span className="text-gray-500 font-semibold">{numberRequestsAproved}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <p className="text-gray-500">Rejeitadas</p>
          <TrendingDown size={20} className="text-red-500"/>
        </div>
        <span className="text-gray-500 font-semibold">{numberRequestsRejected}</span>
      </div>

      <div className="border-t border-gray-400 my-4"></div>

      <div className="flex items-center justify-between space-x-2 mb-4">
        <p className="font-semibold">Taxa de Aprovação</p>
        <p className="font-semibold text-green-500 py-1 px-2 text-2xl">{aprovedPercentage}%</p>
      </div>

      <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${aprovedPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default Weekly;