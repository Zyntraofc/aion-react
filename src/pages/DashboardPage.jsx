import React from 'react';
import Title from '../components/title';
import QuickInformations from '../components/quickInformations';
import icons from '../assets/icons';
import { useHomeData } from '../pages/HomeDataContext.jsx';
import { Zap } from 'lucide-react';

function DashboardPage() {
    const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiYWFiNDZkZGMtMWI4MS00N2EwLTg0NDktZWFmZjI2OTQzODQ1IiwidCI6ImIxNDhmMTRjLTIzOTctNDAyYy1hYjZhLTFiNDcxMTE3N2FjMCJ9";
    const { homeData, loading, error, getField } = useHomeData();

    // Se estiver carregando, mostra um loading
    if (loading) {
        return (
            <div className="flex-1 flex flex-col p-4">
                <Title title="Dashboard" descricao="Acompanhe de maneira geral sua empresa" />
                <div className="flex items-center justify-center h-64 text-gray-600">
                    <Zap size={24} className="animate-spin mr-2 text-indigo-500" />
                    Carregando dados do dashboard...
                </div>
            </div>
        );
    }

    // Se houver erro, mostra mensagem de erro
    if (error) {
        return (
            <div className="flex-1 flex flex-col p-4">
                <Title title="Dashboard" descricao="Acompanhe de maneira geral sua empresa" />
                <div className="flex items-center justify-center h-64 text-gray-600">
                    ❌ Erro ao carregar dados: {error}
                </div>
            </div>
        );
    }

    // Calcula os valores para os cards baseado nos dados da home
    const getQuickCards = () => {
        return [
            {
                title: "Justificativa do Mês",
                value: getField('justificativasMes') || getField('justificativasMes') || getField('justificativasMensal') || 0,
                icon: icons.justification
            },
            {
                title: "Presença Média",
                value: getField('presencaMedia') || getField('presencaMedia') || getField('taxaPresenca') || 99.9,
                color: "green",
                subtitle: "%"
            },
            {
                title: "Tempo médio de resposta",
                value: getField('tempoMedioResposta') || getField('tempoResposta') || getField('tempoMedio') || 0
            },
            {
                title: "Performance excelente",
                value: getField('performanceExcelente') || getField('performance') || getField('altaPerformance') || 0
            }
        ];
    };

    // Verifica se temos dados antes de renderizar
    if (!homeData) {
        return (
            <div className="flex-1 flex flex-col p-4">
                <Title title="Dashboard" descricao="Acompanhe de maneira geral sua empresa" />
                <div className="flex items-center justify-center h-64 text-gray-600">
                    Nenhum dado disponível para o dashboard
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-4">
            <Title title="Dashboard" descricao="Acompanhe de maneira geral sua empresa" />

            <QuickInformations cards={getQuickCards()} />

            <div className="mt-8 w-full flex-1 min-h-[70vh] rounded-xl overflow-hidden
                bg-gradient-to-br from-white via-gray-50 to-gray-100
                shadow-2xl border border-gray-200
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl" style={{ minHeight: '70vh' }}>

                <iframe
                    title="Relatório da Empresa"
                    src={powerBiUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        minHeight: '70vh'
                    }}
                />
            </div>
        </div>
    );
}

export default DashboardPage;