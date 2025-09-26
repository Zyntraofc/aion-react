import React from 'react';
import { UserIcon, BarChart3, FileSearch2Icon } from 'lucide-react';

function QuickInformations({ pendentes, aprovadas, colaboradoresAtivos, taxaAprovacao, analise }) {
  return (
    <div className="flex flex-wrap justify-center gap-5 p-4 rounded-lg w-full">

      {/* Card de informações - Justificativas Pendentes */}
      <div className="flex flex-col p-4 rounded-lg shadow-sm border-2 border-red-200  min-w-[220px]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <h3 className="text-sm font-semibold text-gray-500">Justificativas Pendentes</h3>
        </div>
        <p className="text-3xl font-bold mt-2 ">{pendentes}</p>
      </div>

      {/* Card de informações - Justificativas Aprovadas */}
      <div className="flex flex-col p-4 rounded-lg shadow-sm border-2 border-green-200  min-w-[220px]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <h3 className="text-sm font-semibold text-gray-500">Justificativas Aprovadas</h3>
        </div>
        <p className="text-3xl font-bold mt-2">{aprovadas}</p>
      </div>

      {/* Card de informações - Colaboradores Ativos */}
      <div className="flex flex-col p-4 rounded-lg shadow-sm border-2 border-gray-200  min-w-[220px]">
        <div className="flex items-center space-x-2">
          <UserIcon size={15} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-500">Colaboradores Ativos</h3>
        </div>
        <p className="text-3xl font-bold mt-2">{colaboradoresAtivos}</p>
      </div>
      {/* Card de informações - em analise     */}
      <div className="flex flex-col p-4 rounded-lg shadow-sm border-2 border-gray-200  min-w-[220px]">
        <div className="flex items-center space-x-2">
          <FileSearch2Icon size={15} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-500">Em Análise</h3>
        </div>
        <p className="text-3xl font-bold mt-2 ">{analise}</p>
      </div>

      {/* Card de informações - Taxa de Aprovação */}
      <div className="flex flex-col p-4 rounded-lg shadow-sm border-2 border-gray-200  min-w-[220px]">
        <div className="flex items-center space-x-2">
          <BarChart3 size={15} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-500">Taxa de Aprovação</h3>
        </div>
        <p className="text-3xl font-bold mt-2 ">{taxaAprovacao}%</p>
      </div>



    </div>
  )
}

export default QuickInformations;
