import { PlusIcon, Download, BarChart2, Settings, UserPlus, CalendarCheck } from "lucide-react";
import React from "react";

function QuickActions() {
    return(
        <div className="flex flex-col p-6 space-y-4 rounded-2xl border border-transparent shadow-sm "
             style={{ background: `
                                  linear-gradient(white, white) padding-box,
                                  radial-gradient(circle at top right, rgba(255,255,255,0.9), rgba(122,133,255,0.6)) border-box,
                                  radial-gradient(circle at bottom left, rgba(255,255,255,0.9), rgba(122,133,255,0.6)) border-box
                                `,
             }}>
            <h2 className="font-semibold text-gray-800">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Card de Ação - Nova Justificativa */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-200 cursor-pointer hover:bg-gray-50">
                    <div className="p-3 bg-blue-600 text-white rounded-full mr-4">
                        <PlusIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Nova Justificativa</h3>
                        <p className="text-sm text-gray-500">Cadastrar nova justificativa</p>
                    </div>
                </div>

                {/* Card de Ação - Visualizar Relatórios */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-200 cursor-pointer  hover:bg-gray-50">
                    <div className="p-3">
                        <BarChart2 size={20} />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Visualizar Relatórios</h3>
                        <p className="text-sm text-gray-500">Acessar dashboards e métricas</p>
                    </div>
                </div>

                {/* Card de Ação - Exportar dados */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-200  cursor-pointer  hover:bg-gray-50">
                    <div className="p-3">
                        <Download size={20} />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Exportar Dados</h3>
                        <p className="text-sm text-gray-500">Baixar relatórios em Excel/PDF</p>
                    </div>
                </div>

                {/* Card de Ação - Cadastrar Colaborador */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-200 cursor-pointer  hover:bg-gray-50">
                    <div className="p-3">
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Cadastrar Colaborador</h3>
                        <p className="text-sm text-gray-500">Adicionar novo funcionário</p>
                    </div>
                </div>

                {/* Card de Ação - Configurar Permissões */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-200 cursor-pointer  hover:bg-gray-50">
                    <div className="p-3 ">
                        <Settings size={20} />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Configurações</h3>
                        <p className="text-sm text-gray-500">Gerenciar sistemas e permissões</p>
                    </div>
                </div>

                {/* Card de Ação - Agenda de Análise */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-200 cursor-pointer  hover:bg-gray-50">
                    <div className="p-3 ">
                        <CalendarCheck size={20} />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Agenda de Análises</h3>
                        <p className="text-sm text-gray-500">Visualizar prazos e pendências</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default QuickActions;
