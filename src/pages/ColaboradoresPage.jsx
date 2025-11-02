// ColaboradoresPage.js
import React, { useState, useEffect } from 'react';
import QuickInformations from "../components/quickInformations/index.jsx";
import Title from "../components/title/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import AddColaboradorCard from "../components/addColaboratorCard/AddColaboradorCard.jsx";
import ViewEmployeeModal from "../components/colaborator/viewColaboratorCard";
import { Zap } from 'lucide-react';
import { registry } from '../utils/registry.js';
import { useHomeData } from '../pages/HomeDataContext.jsx'; // Importe o hook

function ColaboradoresPage() {
    const [openCardAdd, setOpenCardAdd] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [isLoading, setIsLoading] = useState(true);
    const [colaboradoresData, setColaboradoresData] = useState(null);

    // Use o hook do homeData
    const { homeData, loading: homeLoading, getField } = useHomeData();

    useEffect(() => {
        const loadColaboradoresData = async () => {
            try {
                setIsLoading(true);
                console.log('🔄 Carregando dados de colaboradores...');

                const data = await registry.colaboradores.fetchData();
                console.log('📊 Dados de colaboradores recebidos:', data);

                setColaboradoresData(data);
            } catch (error) {
                console.error('❌ Erro ao carregar dados de colaboradores:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadColaboradoresData();
    }, []);

    const handleViewEmployee = (employee) => {
        setSelectedEmployee(employee);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEditEmployee = (employee) => {
        setSelectedEmployee(employee);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleDeleteEmployee = (employee) => {
        if (confirm(`Tem certeza que deseja excluir ${employee.nomeCompleto}?`)) {
            console.log("Deletar:", employee);
        }
    };

    const handleSuccess = () => {
        console.log("Operação realizada com sucesso!");
        setIsModalOpen(false);
        loadColaboradoresData();
    };

    const loadColaboradoresData = async () => {
        try {
            const data = await registry.colaboradores.fetchData();
            setColaboradoresData(data);
        } catch (error) {
            console.error('❌ Erro ao recarregar dados:', error);
        }
    };

    // Calcular estatísticas usando dados da home quando disponíveis
    const calculateStats = () => {
        // Se temos dados da home, use-os
        if (homeData) {
            console.log('📊 Usando dados da home para estatísticas:', homeData);
            return [
                { title: "Total", value: getField('totalColaboradores') || 0 },
                { title: "Ativos", value: getField('colaboradoresAtivos') || 0, color: "green" },
                { title: "Inativos", value: getField('colaboradoresInativos') || 0 },
                { title: "Departamentos", value: getField('totalDepartamentos') || 0 }
            ];
        }

        // Fallback para dados dos colaboradores se homeData não estiver disponível
        if (!colaboradoresData || !colaboradoresData.data) {
            return [
                { title: "Total", value: 0 },
                { title: "Ativos", value: 0, color: "green" },
                { title: "Inativos", value: 0 },
                { title: "Departamentos", value: 0 }
            ];
        }

        const data = colaboradoresData.data;
        const total = data.length;
        const ativos = data.filter(emp => emp.ativo === '1' || emp.ativo === 1).length;
        const inativos = data.filter(emp => emp.ativo === '0' || emp.ativo === 0).length;
        const departamentosUnicos = new Set(data.map(emp => emp.cdDepartamento)).size;

        return [
            { title: "Total", value: total },
            { title: "Ativos", value: ativos, color: "green" },
            { title: "Inativos", value: inativos },
            { title: "Departamentos", value: departamentosUnicos }
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

    return (
        <div className='flex-1 flex flex-col'>
            <div className="flex items-center justify-between w-full">
                <Title
                    title="Colaboradores"
                    descricao="Gerencie informações dos funcionários"
                />
                <div
                    className="bg-tertiary p-4 mr-4 h-8 rounded-lg flex items-center justify-center text-center text-white hover:bg-tertiary/80 cursor-pointer"
                    onClick={() => setOpenCardAdd(true)}
                >
                    <p>Novo Colaborador</p>
                </div>
            </div>

            <QuickInformations cards={calculateStats()} />

            <div className="bg-white p-4 mt-1 mr-4 shadow-md rounded-2xl flex flex-col gap-2">
                <SearchBar />
                <GenericList
                    resource="colaboradores"
                    visibleColumns={[
                        'nomeCompleto',
                        'cdMatricula',
                        'cdCargo',
                        'cdDepartamento',
                        'ativo',
                        'faltas',
                        'actions'
                    ]}
                    onViewEmployee={handleViewEmployee}
                    onEditEmployee={handleEditEmployee}
                    onDeleteEmployee={handleDeleteEmployee}
                    initialData={colaboradoresData}
                />
            </div>

            <AddColaboradorCard
                open={openCardAdd}
                onClose={() => setOpenCardAdd(false)}
                onSuccess={handleSuccess}
            />
            <ViewEmployeeModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                employee={selectedEmployee}
                onSuccess={handleSuccess}
                mode={modalMode}
            />
        </div>
    );
}

export default ColaboradoresPage;