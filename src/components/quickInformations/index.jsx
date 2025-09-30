import React from 'react';
import { UserIcon, BarChart3, FileSearch2Icon } from 'lucide-react';

function QuickInformations({ info1, info2, info3, info4, titulo1, titulo2, titulo3, titulo4 }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 p-4 w-full" >

      {/* Card de informações - Justificativas Pendentes */}
      <div className="flex flex-col p-3 rounded-2xl shadow-sm border-2 border-red-200 min-w-[250px] bg-white"> {/* Menos padding, bordas mais arredondadas e largura um pouco menor */}
        <div className="flex items-center space-x-1"> {/* Menos espaçamento horizontal */}
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <h3 className="text-xs font-semibold text-gray-500">{titulo1}</h3> {/* Tamanho da fonte menor */}
        </div>
        <p className="text-2xl font-bold mt-1">{info1}</p> {/* Menos padding vertical */}
      </div>

      {/* Card de informações - Justificativas Aprovadas */}
      <div className="flex flex-col p-3 rounded-2xl shadow-sm border-2 border-green-200 min-w-[250px] bg-white">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <h3 className="text-xs font-semibold text-gray-500">{titulo2}</h3>
        </div>
        <p className="text-2xl font-bold mt-1">{info2}</p>
      </div>

      {/* Card de informações - Colaboradores Ativos */}
      <div className="flex flex-col p-3 rounded-2xl shadow-sm border-2 border-gray-200 min-w-[250px] bg-white">
        <div className="flex items-center space-x-1">
          <UserIcon size={13} className="text-blue-500" />
          <h3 className="text-xs font-semibold text-gray-500">{titulo3}</h3>
        </div>
        <p className="text-2xl font-bold mt-1">{info3}</p>
      </div>

      {/* Card de informações - Taxa de Aprovação */}
      <div className="flex flex-col p-3 rounded-2xl shadow-sm border-2 border-gray-200 min-w-[250px] bg-white">
        <div className="flex items-center space-x-1">
          <BarChart3 size={13} className="text-blue-500" />
          <h3 className="text-xs font-semibold text-gray-500">{titulo4}</h3>
        </div>
        <p className="text-2xl font-bold mt-1">{info4}%</p>
      </div>
    </div>
  )
}

export default QuickInformations;