import React, {useState} from 'react';
import QuickInformations from "../components/quickInformations/index.jsx";
import Title from "../components/title/index.jsx";
import GenericList from "../components/GenericList/GenericList.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import AddColaboradorCard from "../components/addColaboratorCard/AddColaboradorCard.jsx";
import ViewEmployeeModal from "../components/colaborator/viewColaboratorCard";


function ColaboradoresPage() {

    const [openCardAdd, setopenCardAdd] = useState(false);
    const [openCardView, setopenCardView] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Estado para armazenar o colaborador selecionado

    const handleViewEmployee = (employee) => {
        setSelectedEmployee(employee);
        setopenCardView(true);
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
                <GenericList resource="colaboradores"
                             visibleColumns={['nomeCompleto','matricula','cdCargo','ativo','actions']}
                             onViewEmployee={handleViewEmployee} // Passa a função como prop
                />
            </div>
            <AddColaboradorCard
                open={openCardAdd}
                onClose={() => setopenCardAdd(false)}
                onSuccess={() => console.log("Colaborador criado com sucesso!")}
            />
            <ViewEmployeeModal
                open={openCardView}
                onClose={() => {
                    setopenCardView(false);
                    setSelectedEmployee(null); // Limpa o colaborador ao fechar
                }}
                employee={selectedEmployee} // Passa o colaborador selecionado
            />
        </div>
    );
}

export default ColaboradoresPage;