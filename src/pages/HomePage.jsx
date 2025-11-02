import React from 'react';
import Header from "../components/header/index.jsx";
import Title from "../components/title/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import QuickActions from "../components/quickActions/index.jsx";
import AtividadeRecente from "../components/recent/index.jsx";
import { useHomeData } from '../pages/HomeDataContext.jsx'; // Importe o hook
import { Zap } from 'lucide-react';

export default function HomePage() {
    const { homeData, loading, error, getField } = useHomeData();

    // Se estiver carregando, mostra um loading
    if (loading) {
        return (
            <div className="flex-1 flex flex-col">
                <Title title="Visão Geral" descricao="Visão geral das atividades de RH" />
                <div className="flex items-center justify-center h-64 text-gray-600">
                    <Zap size={24} className="animate-spin mr-2 text-indigo-500" />
                    Carregando dados da dashboard...
                </div>
            </div>
        );
    }

    // Se houver erro, mostra mensagem de erro
    if (error) {
        return (
            <div className="flex-1 flex flex-col">
                <Title title="Visão Geral" descricao="Visão geral das atividades de RH" />
                <div className="flex items-center justify-center h-64 text-gray-600">
                    ❌ Erro ao carregar dados: {error}
                </div>
            </div>
        );
    }

    // Calcula os valores para os cards baseado nos dados da home
    const getCardValues = () => {
        // Use os campos específicos do localStorage ou dados da home
        // Ajuste os nomes dos campos conforme a estrutura retornada pela sua API
        return [
            {
                title: "Justificativas Pendentes",
                value: getField('justificativasPendentes') || getField('pendentes') || 0,
                color: "yellow"
            },
            {
                title: "Justificativas Aprovadas",
                value: getField('justificativasAprovadas') || getField('aprovadas') || 0,
                color: "green"
            },
            {
                title: "Colaboradores Ativos",
                value: getField('colaboradoresAtivos') || getField('ativos') || 0
            },
            {
                title: "Taxa de Aprovação",
                value: getField('taxaAprovacao') || getField('taxa') || '0%'
            }
        ];
    };

    // Verifica se temos dados antes de renderizar
    if (!homeData) {
        return (
            <div className="flex-1 flex flex-col">
                <Title title="Visão Geral" descricao="Visão geral das atividades de RH" />
                <div className="flex items-center justify-center h-64 text-gray-600">
                    Nenhum dado disponível
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            <Title title="Visão Geral" descricao="Visão geral das atividades de RH" />

            <QuickInformations cards={getCardValues()} />

            <div className="flex flex-wrap pt-2 -mx-2">
                <div className="w-full sm:w-1/2 lg:w-3/5 px-2 mb-4 lg:mb-0">
                    <QuickActions />
                </div>

                <div className="w-full sm:w-1/2 lg:w-2/5 px-2 mb-4 lg:mb-0">
                    <AtividadeRecente
                        limite={3}
                        // Passe os dados da home se o componente precisar
                        homeData={homeData}
                    />
                </div>
            </div>
        </div>
    );
}