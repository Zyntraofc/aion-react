import React, { useState } from 'react';
import Headers from "../components/header/index.jsx";
import Title from "../components/title/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";
import ViewJustificationModal from "../components/justificativa/index.jsx";
import { useJustificativasController } from "../utils/useJustificativasController.js"; // ← Importe o novo hook

function JustificativasPage() {
    const [selectedJustification, setSelectedJustification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use o controller customizado para justificativas
    const justificativasController = useJustificativasController();

    const handleViewJustification = (justification) => {
        console.log("🎯 handleViewJustification chamado com:", justification);
        setSelectedJustification(justification);
        setIsModalOpen(true);
    };

    const handleSuccess = (action) => {
        console.log(`✅ Ação realizada: ${action}`);
        // Recarregar os dados após ação
        justificativasController.refresh();
        setIsModalOpen(false);
        setSelectedJustification(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJustification(null);
    };

    return(
        <div className='flex-1 flex flex-col'>
            <Title title="Justificativa" descricao={"Gerencie e analise justificativas de ausência."}/>

            <QuickInformations cards={[
                {title: "Pendentes", value: 2, color: "yellow", subtitle: "Total recebidas: 12%"},
                {title: "Aprovadas",  value: 1, color: "green"},
                {title: "Recusadas",  value: 1 , color: "red"},
                {title: "Total", value: 4}
            ]}/>

            <div className="bg-white p-4 mt-1 mr-4 shadow-md rounded-2xl flex flex-col gap-2">
                <SearchBar/>
                <GenericList
                    resource="justificativas"
                    actionType="justificativa"
                    customController={justificativasController} // ← Passe o controller customizado
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