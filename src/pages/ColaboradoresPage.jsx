import React, {useState} from 'react';
import QuickInformations from "../components/quickInformations/index.jsx";
import Title from "../components/title/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import AddColaboradorCard from "../components/addColaboratorCard/AddColaboradorCard.jsx";
import ViewEmployeeModal from "../components/colaborator/viewColaboratorCard";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

function ColaboradoresPage() {

    const [openCardAdd, setopenCardAdd] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");


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
            // Implementar lógica de deleção
        }
    };

    const handleSuccess = () => {
        console.log("Operação realizada com sucesso!");
        setIsModalOpen(false);
    };

    return (
        <div className='flex-1 flex flex-col'>
            <div className="flex items-center justify-between w-full">
                <Title
                    title="Colaboradores"
                    descricao="Gerencie informações dos funcionários"
                />
                <div className="bg-tertiary p-4 mr-4 h-8 rounded-lg flex items-center justify-center text-center text-white hover:bg-tertiary/80 cursor-pointer "
                     onClick={() => setopenCardAdd(true)} >
                    <p>Novo Colaborador</p>
                </div>
            </div>


            <QuickInformations cards={[
                {title: "Total", value: 47},
                {title: "Ativos",  value: 47, color: "green"},
                {title: "Inativos",  value: 47 },
                {title: "Departamentos", value: 47 }
            ]}
            />
            <div className="bg-white p-4 mt-1 mr-4 shadow-md rounded-2xl flex flex-col gap-2">
                <SearchBar/>
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
                onClose={() => setopenCardAdd(false)}
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