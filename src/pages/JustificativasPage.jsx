import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import Title from "../components/title/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";
import ViewJustificationModal from "../components/justificativa/index.jsx";
import { useHomeData } from '../pages/HomeDataContext.jsx';
import { registry } from '../utils/registry.js';

function JustificativasPage() {
    const [selectedJustification, setSelectedJustification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [debug, setDebug] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [justificativas, setJustificativas] = useState([]);
    const { homeData, loading: homeLoading, getField } = useHomeData();

    useEffect(() => {
        const loadJustificativas = async () => {
            try {
                setIsLoading(true);
                console.log('🔄 Carregando justificativas via registry...');

                // Usa o registry para buscar as justificativas
                const data = await registry.justificativas.fetchData();
                console.log('📊 Dados de justificativas recebidos:', data);

                setJustificativas(data.data || []);
            } catch (error) {
                console.error('❌ Erro ao carregar justificativas:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadJustificativas();
    }, []);

    const handleViewJustification = (justification) => {
        setDebug(`Modal aberto em: ${new Date().toLocaleTimeString()} - Funcionário: ${justification.cdFuncionario}`);
        setSelectedJustification(justification);
        setIsModalOpen(true);
    };

    const handleSuccess = (action) => {
        setDebug(`Ação ${action} realizada em: ${new Date().toLocaleTimeString()}`);
        setIsModalOpen(false);
        setSelectedJustification(null);
        // Recarregar as justificativas após uma ação
        loadJustificativas();
    };

    const handleCloseModal = () => {
        setDebug(`Modal fechado em: ${new Date().toLocaleTimeString()}`);
        setIsModalOpen(false);
        setSelectedJustification(null);
    };

    const loadJustificativas = async () => {
        try {
            const data = await registry.justificativas.fetchData();
            setJustificativas(data.data || []);
        } catch (error) {
            console.error('❌ Erro ao recarregar justificativas:', error);
        }
    };

    // Calcular estatísticas usando dados da home quando disponíveis
    const getCardValues = () => {
        // Se temos dados da home, use-os
        if (homeData) {
            console.log('📊 Usando dados da home para estatísticas de justificativas:', homeData);
            return [
                {
                    title: "Pendentes",
                    value: getField('justificativasPendentes') || getField('pendentes') || 0,
                    color: "yellow",
                },
                {
                    title: "Aprovadas",
                    value: getField('justificativasAprovadas') || getField('aprovadas') || 0,
                    color: "green",
                    subtitle: "de "+getField('totalJustificativas') || 0
                },
                {
                    title: "Recusadas",
                    value: getField('justificativasRecusadas') || getField('recusadas') || 0,
                    color: "red"
                },
                {
                    title: "Total",
                    value: getField('totalJustificativas') || getField('total') || justificativas.length
                }
            ];
        }

        // Fallback: calcular baseado nas justificativas locais
        const pendentes = justificativas.filter(j => j.status === '0' || j.status === 0).length;
        const aprovadas = justificativas.filter(j => j.status === '1' || j.status === 1).length;
        const recusadas = justificativas.filter(j => j.status === '2' || j.status === 2).length;

        return [
            { title: "Pendentes", value: pendentes, color: "yellow", subtitle: "Total recebidas: 12%" },
            { title: "Aprovadas", value: aprovadas, color: "green" },
            { title: "Recusadas", value: recusadas, color: "red" },
            { title: "Total", value: justificativas.length }
        ];
    };

    // Mostrar loading apenas se ambos estiverem carregando
    const showLoading = isLoading && homeLoading;

    if (showLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-600">
                <Zap size={24} className="animate-spin mr-2 text-indigo-500" />
                Carregando dados...
            </div>
        );
    }

    return(
        <div className='flex-1 flex flex-col'>
            <Title title="Justificativa" descricao={"Gerencie e analise justificativas de ausência."}/>

            <QuickInformations cards={getCardValues()} />

            <div className="bg-white p-4 mt-1 mr-4 shadow-md rounded-2xl flex flex-col gap-2">
                <SearchBar/>
                <GenericList
                    resource="justificativas"
                    actionType="justificativa"
                    data={justificativas}
                    visibleColumns={[
                        'dataHoraBatida',
                        'cdFuncionario',
                        'justificativa',
                        'status',
                        'situacao',
                        'actions',
                    ]}
                    onViewEmployee={handleViewJustification}
                />
            </div>

            <ViewJustificationModal
                open={isModalOpen}
                onClose={handleCloseModal}
                justification={selectedJustification}
                onSuccess={handleSuccess}
            />
        </div>
    )
}

export default JustificativasPage;