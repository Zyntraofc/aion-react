import React, { useState, useEffect } from 'react';
import QuickInformations from "../components/quickInformations/index.jsx";
import Title from "../components/title/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import AddColaboradorCard from "../components/addColaboratorCard/AddColaboradorCard.jsx";
import ViewEmployeeModal from "../components/colaborator/viewColaboratorCard";
import { Zap } from 'lucide-react';

function ColaboradoresPage() {
  const [openCardAdd, setOpenCardAdd] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
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
  };

  if (isLoading) {
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

      <QuickInformations cards={[
        { title: "Total", value: 47 },
        { title: "Ativos", value: 47, color: "green" },
        { title: "Inativos", value: 47 },
        { title: "Departamentos", value: 47 }
      ]}
      />

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
        />
      </div>

      <AddColaboradorCard
        open={openCardAdd}
        onClose={() => setOpenCardAdd(false)}
        onSuccess={() => console.log("Colaborador criado com sucesso!")}
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
