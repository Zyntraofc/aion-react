import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react'; // spinner
import Headers from "../components/header/index.jsx";
import Title from "../components/title/index.jsx";
import QuickInformations from "../components/quickInformations/index.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";
import ViewJustificationModal from "../components/justificativa/index.jsx";
import axios from "axios";

function JustificativasPage() {
  const [selectedJustification, setSelectedJustification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debug, setDebug] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [justificativas, setJustificativas] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/motivoFalta/listar")
      .then((res) => {
        setJustificativas(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar justificativas:", err);
        setIsLoading(false);
      });
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
  };

  const handleCloseModal = () => {
    setDebug(`Modal fechado em: ${new Date().toLocaleTimeString()}`);
    setIsModalOpen(false);
    setSelectedJustification(null);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-600">
      <Zap size={24} className="animate-spin mr-2 text-indigo-500" />
      Carregando dados...
    </div>
  );

  return(
    <div className='flex-1 flex flex-col'>
      <Title title="Justificativa" descricao={"Gerencie e analise justificativas de ausência."}/>

      <QuickInformations cards={[
        {title: "Pendentes", value: 2, color: "yellow", subtitle: "Total recebidas: 12%"},
        {title: "Aprovadas",  value: 1, color: "green"},
        {title: "Recusadas",  value: 1 , color: "red"},
        {title: "Total", value: justificativas.length}
      ]}
      />

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
